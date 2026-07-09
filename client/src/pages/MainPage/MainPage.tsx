import "./MainPage.css";
import AddTaskForm from "@/components/AddForm/AddForm";
import ConfettiLayer from "@/components/Effects/ConfettiLayer/ConfettiLayer";
import FilterBar from "@/components/FilterBar/FilterBar";
import Snackbar from "@/components/Snackbar/Snackbar";
import TaskTable from "@/components/Table/Table";
import { useConfetti } from "@/hooks/useConfetti";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/task";

// Composes the whole page: data/hooks + layout. App.tsx just renders this.
export default function MainPage() {
  const {
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
  } = useTasks();
  const { pieces, fire } = useConfetti();

  // A father finishing counts as finished whether it was checked directly or
  // it just became complete because its last open subtask was -- the latter
  // mirrors the server's own "all subtasks done" rule so it fires in step
  // with the auto-complete instead of waiting on the response.
  const handleToggleComplete = (task: Task) => {
    if (!task.isComplete) {
      if (task.parentId === null) {
        fire();
      } else {
        const siblings = subtasksByParent.get(task.parentId) ?? [];
        const isLastOpenSubtask = siblings.every(
          (sibling) => sibling.id === task.id || sibling.isComplete,
        );
        if (isLastOpenSubtask) {
          fire();
        }
      }
    }
    toggleComplete(task);
  };

  return (
    <main className="app">
      <ConfettiLayer pieces={pieces} />
      <Snackbar notice={notice} onDismiss={clearNotice} />
      <section className="card">
        <p className="eyebrow">Home Assignment - @Yarin</p>
        <h1>Task Manager</h1>

        <AddTaskForm onAdd={addTask} parentOptions={topLevelTasks} />

        <FilterBar
          isComplete={filters.isComplete}
          priority={filters.priority}
          title={filters.title}
          onIsCompleteChange={(isComplete) =>
            setFilters((prev) => ({ ...prev, isComplete }))
          }
          onPriorityChange={(priority) =>
            setFilters((prev) => ({ ...prev, priority }))
          }
          onTitleChange={(title) =>
            setFilters((prev) => ({ ...prev, title }))
          }
        />

        <TaskTable
          tasks={tasks}
          subtasksByParent={subtasksByParent}
          sortBy={sort.sortBy}
          order={sort.order}
          onSort={toggleSort}
          onToggleComplete={handleToggleComplete}
          onDelete={removeTask}
        />

        {loading && <p className="loading">Loading…</p>}
      </section>
    </main>
  );
}
