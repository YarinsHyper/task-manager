import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateTaskInput, Task, TaskPriority } from "../../types/task";

interface Props {
  onAdd: (input: CreateTaskInput) => void;
  // Existing top-level tasks this new task can be nested under. Subtasks
  // can't have their own subtasks, so this is never the full task list.
  parentOptions: Task[];
}

// New tasks always start incomplete -- there's no isComplete field here.
export default function AddTaskForm({ onAdd, parentOptions }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [parentId, setParentId] = useState<number | "">("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, parentId: parentId === "" ? null : parentId });
    setTitle("");
    setPriority("medium");
    setParentId("");
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="New task title"
        aria-label="Task title"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskPriority)}
        aria-label="Task priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={parentId}
        onChange={(event) =>
          setParentId(event.target.value === "" ? "" : Number(event.target.value))
        }
        aria-label="Parent task"
      >
        <option value="">None</option>
        {parentOptions.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!title.trim()}>
        Add Task
      </button>
    </form>
  );
}
