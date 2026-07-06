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
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  isComplete?: boolean;
}
