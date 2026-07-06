import { API_BASE_URL } from "../config";
import type {
  DeleteResponse,
  TaskListResponse,
  TaskResponse,
} from "../types/api";
import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";
import { handleResponse } from "../utils/http";

const jsonHeaders = { "Content-Type": "application/json" };

// The only place in the app that calls fetch() directly.
export const tasksApi = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(API_BASE_URL);
    const { tasks } = await handleResponse<TaskListResponse>(res);
    return tasks;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(input),
    });
    const { task } = await handleResponse<TaskResponse>(res);
    return task;
  },

  async update(id: number, input: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify(input),
    });
    const { task } = await handleResponse<TaskResponse>(res);
    return task;
  },

  async delete(id: number): Promise<number> {
    const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    const { id: deletedId } = await handleResponse<DeleteResponse>(res);
    return deletedId;
  },
};
