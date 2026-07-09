import { Fragment, useState } from "react";
import type { SortOrder, Task, TaskSortColumn } from "../../types/task";
import SubtaskTable from "./SubtaskTable/SubtaskTable";
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

// Expand column + actions column, on top of the sortable ones above.
const EXTRA_COLUMN_COUNT = 2;

interface Props {
  tasks: Task[];
  subtasksByParent: Map<number, Task[]>;
  sortBy: TaskSortColumn;
  order: SortOrder;
  onSort: (column: TaskSortColumn) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskTable({
  tasks,
  subtasksByParent,
  sortBy,
  order,
  onSort,
  onToggleComplete,
  onDelete,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th />
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
        {tasks.map((task) => {
          const subtasks = subtasksByParent.get(task.id) ?? [];
          const expanded = expandedIds.has(task.id);
          return (
            <Fragment key={task.id}>
              <TaskRow
                task={task}
                hasSubtasks={subtasks.length > 0}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
              />
              {expanded && subtasks.length > 0 && (
                <tr className="subtask-row">
                  <td />
                  <td colSpan={COLUMNS.length + EXTRA_COLUMN_COUNT - 1}>
                    <SubtaskTable
                      subtasks={subtasks}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
        {tasks.length === 0 && (
          <tr>
            <td className="empty-row" colSpan={COLUMNS.length + EXTRA_COLUMN_COUNT}>
              No tasks match the current filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
