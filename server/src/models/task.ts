import { db } from "../db/index.js";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "done";

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

interface TaskRow {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at
  };
}

export interface CreateTaskInput {
  title: string;
  priority: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

const selectAllStmt = db.prepare(`
  SELECT id, title, priority, status, created_at
  FROM tasks
`);

const selectByIdStmt = db.prepare(`
  SELECT id, title, priority, status, created_at
  FROM tasks
  WHERE id = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO tasks (title, priority, status)
  VALUES (@title, @priority, @status)
  RETURNING id, title, priority, status, created_at
`);

const updateStmt = db.prepare(`
  UPDATE tasks
  SET
    title = COALESCE(@title, title),
    priority = COALESCE(@priority, priority),
    status = COALESCE(@status, status)
  WHERE id = @id
  RETURNING id, title, priority, status, created_at
`);

const deleteStmt = db.prepare(`
  DELETE FROM tasks
  WHERE id = ?
`);

export const TaskModel = {
  findAll(): Task[] {
    const rows = selectAllStmt.all() as TaskRow[];
    return rows.map(rowToTask);
  },

  findById(id: number): Task | undefined {
    const row = selectByIdStmt.get(id) as TaskRow | undefined;
    return row ? rowToTask(row) : undefined;
  },

  create(input: CreateTaskInput): Task {
    const row = insertStmt.get({
      title: input.title,
      priority: input.priority,
      status: input.status ?? "todo"
    }) as TaskRow;
    return rowToTask(row);
  },

  update(id: number, input: UpdateTaskInput): Task | undefined {
    const row = updateStmt.get({
      id,
      title: input.title ?? null,
      priority: input.priority ?? null,
      status: input.status ?? null
    }) as TaskRow | undefined;
    return row ? rowToTask(row) : undefined;
  },

  delete(id: number): boolean {
    const result = deleteStmt.run(id);
    return result.changes > 0;
  }
};
