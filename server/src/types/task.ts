export type TaskPriority = "low" | "medium" | "high";

// The shape every API response uses (camelCase).
export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  isComplete: boolean;
  parentId: number | null;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  priority: TaskPriority;
  isComplete?: boolean;
  // Set to make this task a subtask of an existing top-level task.
  parentId?: number | null;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  isComplete?: boolean;
}

// What better-sqlite3 actually returns: snake_case, is_complete as 0/1.
// task.model.ts converts this to a Task before it leaves that module.
export interface TaskRow {
  id: number;
  title: string;
  priority: Task["priority"];
  is_complete: number;
  parent_id: number | null;
  created_at: string;
}
