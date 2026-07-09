import { db } from "../db/index.js";
import type {
  CreateTaskInput,
  Task,
  TaskRow,
  UpdateTaskInput,
} from "../types/task.js";

// Converts a raw DB row into the shape the rest of the app uses.
function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    isComplete: row.is_complete === 1, // conversion from 0/1 to boolean in sqlite
    parentId: row.parent_id,
    createdAt: row.created_at,
  };
}

const findAllStmt = db.prepare(`
  SELECT id, title, priority, is_complete, parent_id, created_at
  FROM tasks
  ORDER BY created_at DESC
`);

const findByIdStmt = db.prepare(`
  SELECT id, title, priority, is_complete, parent_id, created_at
  FROM tasks
  WHERE id = ?
`);

const findChildrenStmt = db.prepare(`
  SELECT id, title, priority, is_complete, parent_id, created_at
  FROM tasks
  WHERE parent_id = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, priority, is_complete, parent_id)
  VALUES (@title, @priority, @isComplete, @parentId)
  RETURNING id, title, priority, is_complete, parent_id, created_at
`);

const updateStmt = db.prepare(`
  UPDATE tasks
  SET
    title = COALESCE(@title, title),
    priority = COALESCE(@priority, priority),
    is_complete = COALESCE(@isComplete, is_complete)
  WHERE id = @id
  RETURNING id, title, priority, is_complete, parent_id, created_at
`);

const deleteStmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);

// Depth-first walk down the parent_id chain. Task manager datasets are tiny,
// so plain recursive JS queries are simpler here than a recursive CTE.
function findDescendants(id: number): TaskRow[] {
  const children = findChildrenStmt.all(id) as TaskRow[];
  return children.flatMap((child) => [child, ...findDescendants(child.id)]);
}

// A father's done state mirrors "are all of its subtasks done" -- called
// whenever a subtask's own completion changes. Updates only the parent row
// directly (never the parent's own updateTaskInput path), so it can't
// re-trigger the parent-to-children cascade and stomp on sibling subtasks
// that weren't touched.
function syncParentCompletion(parentId: number): Task | null {
  const parentRow = findByIdStmt.get(parentId) as TaskRow | undefined;
  if (!parentRow) return null;

  const children = findChildrenStmt.all(parentId) as TaskRow[];
  if (children.length === 0) return null;

  const targetValue = children.every((child) => child.is_complete === 1) ? 1 : 0;
  if (parentRow.is_complete === targetValue) return null;

  const updatedParent = updateStmt.get({
    id: parentId,
    title: null,
    priority: null,
    isComplete: targetValue,
  }) as TaskRow;
  return rowToTask(updatedParent);
}

// better-sqlite3 only binds numbers/strings/bigints/buffers/null -- never
// raw booleans -- so every boolean crosses this boundary as 0/1.
function toDbBool(value: boolean | undefined): number | null {
  return value === undefined ? null : value ? 1 : 0;
}

// Filtering and sorting happen client-side over a locally cached copy of
// this list, so the API just hands over every row -- see client/src/hooks/useTasks.ts.
export function findAllTasks(): Task[] {
  const rows = findAllStmt.all() as TaskRow[];
  return rows.map(rowToTask);
}

export function findTaskById(id: number): Task | undefined {
  const row = findByIdStmt.get(id) as TaskRow | undefined;
  return row ? rowToTask(row) : undefined;
}

export function insertTask(input: CreateTaskInput): Task {
  const row = insertStmt.get({
    title: input.title,
    priority: input.priority,
    isComplete: toDbBool(input.isComplete) ?? 0,
    parentId: input.parentId ?? null,
  }) as TaskRow;
  return rowToTask(row);
}

export interface UpdateTaskResult {
  task: Task;
  // The updated task plus, when it was just marked complete, every
  // descendant that got swept along with it -- so the client can patch its
  // cache without a follow-up fetch.
  affected: Task[];
}

export function updateTaskInput(
  id: number,
  input: UpdateTaskInput,
): UpdateTaskResult | undefined {
  const applyUpdate = db.transaction((): UpdateTaskResult | undefined => {
    const row = updateStmt.get({
      id,
      title: input.title ?? null,
      priority: input.priority ?? null,
      isComplete: toDbBool(input.isComplete),
    }) as TaskRow | undefined;
    if (!row) return undefined;

    const task = rowToTask(row);
    const affected = [task];

    // Toggling a task's done state carries every descendant along with it,
    // recursively, in the same direction -- done cascades down to done,
    // todo cascades down to todo. Descendants already at that state are
    // left untouched (and left out of `affected`).
    if (input.isComplete !== undefined) {
      const targetValue = toDbBool(input.isComplete) as number;
      for (const descendant of findDescendants(id)) {
        if (descendant.is_complete === targetValue) continue;
        const updatedChild = updateStmt.get({
          id: descendant.id,
          title: null,
          priority: null,
          isComplete: targetValue,
        }) as TaskRow;
        affected.push(rowToTask(updatedChild));
      }

      // The other direction: finishing the last open subtask completes its
      // father, and reopening a subtask reopens a father that was complete.
      if (task.parentId !== null) {
        const updatedParent = syncParentCompletion(task.parentId);
        if (updatedParent) affected.push(updatedParent);
      }
    }

    return { task, affected };
  });

  return applyUpdate();
}

export interface DeleteTaskResult {
  id: number;
  // Descendant ids removed along with it via ON DELETE CASCADE.
  deletedIds: number[];
}

export function deleteTask(id: number): DeleteTaskResult | undefined {
  const applyDelete = db.transaction((): DeleteTaskResult | undefined => {
    const descendantIds = findDescendants(id).map((row) => row.id);
    const deleted = deleteStmt.run(id).changes > 0;
    if (!deleted) return undefined;
    return { id, deletedIds: [id, ...descendantIds] };
  });

  return applyDelete();
}
