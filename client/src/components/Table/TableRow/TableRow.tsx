import type { Task } from "../../../types/task";

// One row: renders a task and reports clicks back up, no state of its own.
interface Props {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskRow({ task, onToggleComplete, onDelete }: Props) {
  return (
    <tr>
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
