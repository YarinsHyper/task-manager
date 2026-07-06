import type { TaskPriority } from "../../types/task";

interface Props {
  isComplete?: boolean;
  priority?: TaskPriority;
  onIsCompleteChange: (isComplete?: boolean) => void;
  onPriorityChange: (priority?: TaskPriority) => void;
}

// <select> values are always strings, so map back to boolean | undefined.
function parseIsComplete(value: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export default function FilterBar({ isComplete, priority, onIsCompleteChange, onPriorityChange }: Props) {
  return (
    <div className="filter-bar">
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
