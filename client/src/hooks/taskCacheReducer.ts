import type { Task } from "../types/task";

// The in-memory cache of every task the client knows about. Mutations patch
// this directly from their own response payload -- nothing here ever
// triggers a network call; a fresh GET only happens once, on initial load.
export type TaskCacheAction =
  | { type: "loaded"; tasks: Task[] }
  | { type: "added"; task: Task }
  | { type: "updated"; tasks: Task[] }
  | { type: "removed"; ids: number[] };

export function taskCacheReducer(state: Task[], action: TaskCacheAction): Task[] {
  switch (action.type) {
    case "loaded":
      return action.tasks;
    case "added":
      return [...state, action.task];
    case "updated": {
      const byId = new Map(action.tasks.map((task) => [task.id, task]));
      return state.map((task) => byId.get(task.id) ?? task);
    }
    case "removed":
      return state.filter((task) => !action.ids.includes(task.id));
  }
}
