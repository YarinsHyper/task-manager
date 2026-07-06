import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { tasksApi } from "../api/tasks";
import type { Notice } from "../types/notice";
import type {
  CreateTaskInput,
  SortOrder,
  Task,
  TaskPriority,
  TaskSortColumn,
} from "../types/task";
import { taskCacheReducer } from "./taskCacheReducer";

interface Filters {
  isComplete?: boolean;
  priority?: TaskPriority;
}

interface Sort {
  sortBy: TaskSortColumn;
  order: SortOrder;
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

// low/medium/high isn't alphabetical order, so rank them explicitly --
// mirrors the CASE expression the server used before sorting moved here.
// isComplete/title also get their own branch: TS won't allow `<`/`>` on
// booleans directly, and title needs locale-aware comparison, not `<`.
function compareTasks(a: Task, b: Task, sort: Sort): number {
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

// Fetches the full task list exactly once (see the effect below) and keeps
// it in `cache`, a plain useReducer store. Every mutation patches that cache
// directly from its own response -- no follow-up GET, no re-deriving the
// list from the server just to reflect a change the client already knows.
// Filtering/sorting are pure client-side views over the cache (useMemo),
// recomputed instantly from local UI state with no network round trip.
export function useTasks() {
  const [cache, dispatch] = useReducer(taskCacheReducer, []);
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<Sort>({
    sortBy: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);

  // StrictMode double-invokes effects on mount in dev (mount, cleanup,
  // mount again) to catch missing cleanup logic. This fetch has nothing to
  // clean up, so the second invocation would just be a redundant request;
  // this ref makes it a no-op instead.
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    tasksApi
      .getAll()
      .then((tasks) => {
        dispatch({ type: "loaded", tasks });
      })
      .catch((err) => {
        setNotice({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to load tasks",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Auto-dismiss so a notice doesn't sit on screen forever. Keyed on
  // `notice` itself, so a new notice replacing an old one (e.g. two actions
  // in quick succession) restarts the countdown from full length rather
  // than inheriting whatever time was left on the previous one.
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timeout);
  }, [notice]);

  const clearNotice = useCallback(() => setNotice(null), []);

  const tasks = useMemo(() => {
    return cache
      .filter(
        (task) =>
          filters.isComplete === undefined ||
          task.isComplete === filters.isComplete,
      )
      .filter((task) => !filters.priority || task.priority === filters.priority)
      .sort((a, b) => compareTasks(a, b, sort));
  }, [cache, filters, sort]);

  // Deliberately doesn't clear `notice` up front: if one is already showing
  // when a new action starts, it stays put until this action's own outcome
  // overwrites it, instead of blinking out and back in.
  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      const task = await tasksApi.create(input);
      dispatch({ type: "added", task });
      setNotice({ type: "success", message: `Task "${task.title}" added.` });
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to add task",
      });
    }
  }, []);

  const toggleComplete = useCallback(async (task: Task) => {
    try {
      const updated = await tasksApi.update(task.id, {
        isComplete: !task.isComplete,
      });
      dispatch({ type: "updated", task: updated });
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update task",
      });
    }
  }, []);

  const removeTask = useCallback(async (id: number) => {
    try {
      const deletedId = await tasksApi.delete(id);
      dispatch({ type: "removed", id: deletedId });
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete task",
      });
    }
  }, []);

  const toggleSort = useCallback((column: TaskSortColumn) => {
    setSort((prev) =>
      prev.sortBy === column
        ? { sortBy: column, order: prev.order === "asc" ? "desc" : "asc" }
        : { sortBy: column, order: "asc" },
    );
  }, []);

  return {
    tasks,
    loading,
    notice,
    clearNotice,
    filters,
    setFilters,
    sort,
    toggleSort,
    addTask,
    toggleComplete,
    removeTask,
  };
}
