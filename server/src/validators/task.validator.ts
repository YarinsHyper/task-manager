import { AppError } from "../errors/app-error.js";
import type { CreateTaskInput, TaskPriority, UpdateTaskInput } from "../types/task.js";

const PRIORITIES: readonly TaskPriority[] = ["low", "medium", "high"];

function isPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && (PRIORITIES as string[]).includes(value);
}

// req.params can technically be string[] for repeated route segments.
export function parseId(rawId: string | string[]): number {
  if (typeof rawId !== "string") {
    throw new AppError(400, "Invalid task id");
  }
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid task id: "${rawId}"`);
  }
  return id;
}

export function parseCreate(body: unknown): CreateTaskInput {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be a JSON object");
  }
  const { title, priority, isComplete } = body as Record<string, unknown>;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new AppError(400, "title is required and must be a non-empty string");
  }
  if (!isPriority(priority)) {
    throw new AppError(400, `priority must be one of: ${PRIORITIES.join(", ")}`);
  }
  if (isComplete !== undefined && typeof isComplete !== "boolean") {
    throw new AppError(400, "isComplete must be a boolean");
  }

  return { title: title.trim(), priority, isComplete };
}

export function parseUpdate(body: unknown): UpdateTaskInput {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be a JSON object");
  }
  const { title, priority, isComplete } = body as Record<string, unknown>;

  if (title === undefined && priority === undefined && isComplete === undefined) {
    throw new AppError(400, "Provide at least one of: title, priority, isComplete");
  }
  if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
    throw new AppError(400, "title must be a non-empty string");
  }
  if (priority !== undefined && !isPriority(priority)) {
    throw new AppError(400, `priority must be one of: ${PRIORITIES.join(", ")}`);
  }
  if (isComplete !== undefined && typeof isComplete !== "boolean") {
    throw new AppError(400, "isComplete must be a boolean");
  }

  return {
    title: typeof title === "string" ? title.trim() : undefined,
    priority: priority as TaskPriority | undefined,
    isComplete: isComplete as boolean | undefined
  };
}
