import { TaskPriority } from "../types/task.js";
import { PRIORITIES } from "./constants.js";

export function isPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && (PRIORITIES as string[]).includes(value);
}
