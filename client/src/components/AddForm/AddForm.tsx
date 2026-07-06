import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateTaskInput, TaskPriority } from "../../types/task";

interface Props {
  onAdd: (input: CreateTaskInput) => void;
}

// New tasks always start incomplete -- there's no isComplete field here.
export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority });
    setTitle("");
    setPriority("medium");
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
      <button type="submit" disabled={!title.trim()}>
        Add Task
      </button>
    </form>
  );
}
