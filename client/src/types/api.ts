import type { Task } from "./task";

// JSON envelopes matching the server's response shapes.
export interface TaskListResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export interface DeleteResponse {
  id: number;
}
