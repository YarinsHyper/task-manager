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
    createdAt: row.created_at,
  };
}

const findAllStmt = db.prepare(`
  SELECT id, title, priority, is_complete, created_at
  FROM tasks
  ORDER BY created_at DESC
`);

const findByIdStmt = db.prepare(`
  SELECT id, title, priority, is_complete, created_at
  FROM tasks
  WHERE id = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, priority, is_complete)
  VALUES (@title, @priority, @isComplete)
  RETURNING id, title, priority, is_complete, created_at
`);

const updateStmt = db.prepare(`
  UPDATE tasks
  SET
    title = COALESCE(@title, title),
    priority = COALESCE(@priority, priority),
    is_complete = COALESCE(@isComplete, is_complete)
  WHERE id = @id
  RETURNING id, title, priority, is_complete, created_at
`);

const deleteStmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);

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
  }) as TaskRow;
  return rowToTask(row);
}

export function updateTaskInput(
  id: number,
  input: UpdateTaskInput,
): Task | undefined {
  const row = updateStmt.get({
    id,
    title: input.title ?? null,
    priority: input.priority ?? null,
    isComplete: toDbBool(input.isComplete),
  }) as TaskRow | undefined;
  return row ? rowToTask(row) : undefined;
}

export function deleteTask(id: number): boolean {
  return deleteStmt.run(id).changes > 0;
}
