import type { SortOrder, Task, TaskSortColumn } from "../../types/task";
import { TaskRow } from "./TableRow/TableRow";

interface Column {
  key: TaskSortColumn;
  label: string;
}

// Sortable column headers; `key` doubles as the sort column id passed to onSort.
const COLUMNS: Column[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "priority", label: "Priority" },
  { key: "isComplete", label: "Status" },
  { key: "createdAt", label: "Created" },
];

interface Props {
  tasks: Task[];
  sortBy: TaskSortColumn;
  order: SortOrder;
  onSort: (column: TaskSortColumn) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskTable({
  tasks,
  sortBy,
  order,
  onSort,
  onToggleComplete,
  onDelete,
}: Props) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th key={column.key}>
              <button
                type="button"
                className="sort-button"
                onClick={() => onSort(column.key)}
              >
                {column.label}
                {sortBy === column.key ? (order === "asc" ? " ▲" : " ▼") : ""}
              </button>
            </th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <tr>
            <td className="empty-row" colSpan={COLUMNS.length + 1}>
              No tasks match the current filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
