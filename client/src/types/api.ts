import type { Task } from "./task";

// JSON envelopes matching the server's response shapes.
export interface TaskListResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
  // The task itself plus any descendants that were swept along with it
  // (e.g. subtasks auto-completed when their parent was marked done).
  affected?: Task[];
}

export interface DeleteResponse {
  id: number;
  // id plus any descendant subtask ids removed via cascade delete.
  deletedIds?: number[];
}
