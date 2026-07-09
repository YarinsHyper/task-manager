import type { SortOrder, Task, TaskPriority, TaskSortColumn } from "../types/task";

export interface TaskSort {
  sortBy: TaskSortColumn;
  order: SortOrder;
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

// low/medium/high isn't alphabetical order, so rank them explicitly.
// isComplete/title also get their own branch: TS won't allow `<`/`>` on
// booleans directly, and title needs locale-aware comparison, not `<`.
export function compareTasks(a: Task, b: Task, sort: TaskSort): number {
  let result: number;
  if (sort.sortBy === "priority") {
    result = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  } else if (sort.sortBy === "title") {
    result = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  } else if (sort.sortBy === "isComplete") {
    result = Number(a.isComplete) - Number(b.isComplete);
  } else {
    result =
      a[sort.sortBy] < b[sort.sortBy]
        ? -1
        : a[sort.sortBy] > b[sort.sortBy]
          ? 1
          : 0;
  }
  return sort.order === "asc" ? result : -result;
}
