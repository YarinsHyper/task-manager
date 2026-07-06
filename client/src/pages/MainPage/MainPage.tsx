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

  const handleToggleComplete = (task: Task) => {
    if (!task.isComplete) {
      fire();
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

        <AddTaskForm onAdd={addTask} />

        <FilterBar
          isComplete={filters.isComplete}
          priority={filters.priority}
          onIsCompleteChange={(isComplete) =>
            setFilters((prev) => ({ ...prev, isComplete }))
          }
          onPriorityChange={(priority) =>
            setFilters((prev) => ({ ...prev, priority }))
          }
        />

        <TaskTable
          tasks={tasks}
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
