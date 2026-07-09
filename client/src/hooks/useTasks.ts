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
import type { CreateTaskInput, Task, TaskPriority, TaskSortColumn } from "../types/task";
import { compareTasks, type TaskSort } from "../utils/sortTasks";
import { taskCacheReducer } from "./taskCacheReducer";

interface Filters {
  isComplete?: boolean;
  priority?: TaskPriority;
  title?: string;
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
  const [sort, setSort] = useState<TaskSort>({
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

  const subtasksByParent = useMemo(() => {
    const map = new Map<number, Task[]>();
    for (const task of cache) {
      if (task.parentId === null) continue;
      const siblings = map.get(task.parentId) ?? [];
      siblings.push(task);
      map.set(task.parentId, siblings);
    }
    for (const siblings of map.values()) {
      siblings.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return map;
  }, [cache]);

  // Filtering/sorting apply to top-level (father) tasks only, matched by
  // their own title -- subtasks stay grouped under their parent and are
  // shown in full when a row expands, unaffected by these filters.
  const tasks = useMemo(() => {
    return cache
      .filter((task) => task.parentId === null)
      .filter(
        (task) =>
          filters.isComplete === undefined ||
          task.isComplete === filters.isComplete,
      )
      .filter((task) => !filters.priority || task.priority === filters.priority)
      .filter(
        (task) =>
          !filters.title ||
          task.title.toLowerCase().includes(filters.title.toLowerCase()),
      )
      .sort((a, b) => compareTasks(a, b, sort));
  }, [cache, filters, sort]);

  // Deliberately doesn't clear `notice` up front: if one is already showing
  // when a new action starts, it stays put until this action's own outcome
  // overwrites it, instead of blinking out and back in.
  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      const task = await tasksApi.create(input);
      dispatch({ type: "added", task });
      setNotice({
        type: "success",
        message: task.parentId
          ? `Subtask "${task.title}" added.`
          : `Task "${task.title}" added.`,
      });
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to add task",
      });
    }
  }, []);

  const toggleComplete = useCallback(async (task: Task) => {
    try {
      const { affected } = await tasksApi.update(task.id, {
        isComplete: !task.isComplete,
      });
      dispatch({ type: "updated", tasks: affected });
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update task",
      });
    }
  }, []);

  const removeTask = useCallback(async (id: number) => {
    try {
      const deletedIds = await tasksApi.delete(id);
      dispatch({ type: "removed", ids: deletedIds });
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

  // Unfiltered father tasks, for pickers (e.g. "add as subtask of...") that
  // shouldn't be limited by whatever filters currently narrow the table.
  const topLevelTasks = useMemo(
    () => cache.filter((task) => task.parentId === null),
    [cache],
  );

  return {
    tasks,
    topLevelTasks,
    subtasksByParent,
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
