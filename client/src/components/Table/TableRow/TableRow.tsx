import type { Task } from "../../../types/task";

// One row: renders a task and reports clicks back up, no state of its own.
interface Props {
  task: Task;
  hasSubtasks: boolean;
  expanded: boolean;
  onToggleExpand: (id: number) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskRow({
  task,
  hasSubtasks,
  expanded,
  onToggleExpand,
  onToggleComplete,
  onDelete,
}: Props) {
  return (
    <tr>
      <td>
        {hasSubtasks && (
          <button
            type="button"
            className="expand-toggle"
            onClick={() => onToggleExpand(task.id)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"}
          >
            {expanded ? "▼" : "▶"}
          </button>
        )}
      </td>
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
  );
}
