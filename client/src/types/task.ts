export type TaskPriority = "low" | "medium" | "high";
export type TaskSortColumn =
  | "id"
  | "title"
  | "priority"
  | "isComplete"
  | "createdAt";
export type SortOrder = "asc" | "desc";

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
  // Set to make this task a subtask of an existing top-level task.
  parentId?: number | null;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  isComplete?: boolean;
}
