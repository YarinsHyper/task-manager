import { useMemo, useState } from "react";
import type { Task, TaskSortColumn } from "../../../types/task";
import { compareTasks, type TaskSort } from "../../../utils/sortTasks";

interface Column {
  key: TaskSortColumn;
  label: string;
}

const COLUMNS: Column[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "priority", label: "Priority" },
  { key: "isComplete", label: "Status" },
  { key: "createdAt", label: "Created" },
];

// Nested table rendered inside a father row's expanded cell -- lists that
// task's subtasks. No expand column of its own: subtasks can't have subtasks.
// Sorting is local to this table, independent of the main table's sort.
interface Props {
  subtasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function SubtaskTable({ subtasks, onToggleComplete, onDelete }: Props) {
  const [sort, setSort] = useState<TaskSort>({ sortBy: "createdAt", order: "asc" });

  const sortedSubtasks = useMemo(
    () => [...subtasks].sort((a, b) => compareTasks(a, b, sort)),
    [subtasks, sort],
  );

  const toggleSort = (column: TaskSortColumn) => {
    setSort((prev) =>
      prev.sortBy === column
        ? { sortBy: column, order: prev.order === "asc" ? "desc" : "asc" }
        : { sortBy: column, order: "asc" },
    );
  };

  return (
    <table className="subtask-table">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th key={column.key}>
              <button
                type="button"
                className="sort-button"
                onClick={() => toggleSort(column.key)}
              >
                {column.label}
                {sort.sortBy === column.key ? (sort.order === "asc" ? " ▲" : " ▼") : ""}
              </button>
            </th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {sortedSubtasks.map((task) => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.title}</td>
            <td>
              <span className={`badge badge-${task.priority}`}>{task.priority}</span>
            </td>
            <td>
              <label className="status-toggle">
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() => onToggleComplete(task)}
                />
                {task.isComplete ? "Done" : "Todo"}
              </label>
            </td>
            <td>{new Date(task.createdAt).toLocaleString()}</td>
            <td>
              <button
                type="button"
                className="danger"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
