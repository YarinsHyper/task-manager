import type { TaskPriority } from "../../types/task";

interface Props {
  isComplete?: boolean;
  priority?: TaskPriority;
  title?: string;
  onIsCompleteChange: (isComplete?: boolean) => void;
  onPriorityChange: (priority?: TaskPriority) => void;
  onTitleChange: (title?: string) => void;
}

// <select> values are always strings, so map back to boolean | undefined.
function parseIsComplete(value: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export default function FilterBar({
  isComplete,
  priority,
  title,
  onIsCompleteChange,
  onPriorityChange,
  onTitleChange,
}: Props) {
  return (
    <div className="filter-bar">
      <label>
        Name
        <input
          type="text"
          value={title ?? ""}
          placeholder="Search task"
          onChange={(event) => onTitleChange(event.target.value || undefined)}
        />
      </label>
      <label>
        Status
        <select
          value={isComplete === undefined ? "" : String(isComplete)}
          onChange={(event) => onIsCompleteChange(parseIsComplete(event.target.value))}
        >
          <option value="">All</option>
          <option value="false">Todo</option>
          <option value="true">Done</option>
        </select>
      </label>
      <label>
        Priority
        <select
          value={priority ?? ""}
          onChange={(event) => onPriorityChange((event.target.value || undefined) as TaskPriority | undefined)}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>
  );
}
