import type { Task } from "../types/task";

// The in-memory cache of every task the client knows about. Mutations patch
// this directly from their own response payload -- nothing here ever
// triggers a network call; a fresh GET only happens once, on initial load.
export type TaskCacheAction =
  | { type: "loaded"; tasks: Task[] }
  | { type: "added"; task: Task }
  | { type: "updated"; task: Task }
  | { type: "removed"; id: number };

export function taskCacheReducer(state: Task[], action: TaskCacheAction): Task[] {
  switch (action.type) {
    case "loaded":
      return action.tasks;
    case "added":
      return [...state, action.task];
    case "updated":
      return state.map((task) => (task.id === action.task.id ? action.task : task));
    case "removed":
      return state.filter((task) => task.id !== action.id);
  }
}
