import type { Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { catchErrors } from "../middleware/catch-errors.js";
import {
  deleteTask,
  findAllTasks,
  findTaskById,
  insertTask,
  updateTaskInput,
} from "../models/task.model.js";
import { parseCreate, parseId, parseUpdate } from "../validators/task.validator.js";

export const getAllTasks = catchErrors((_req: Request, res: Response) => {
  const tasks = findAllTasks();
  res.json({ tasks });
});

export const createTask = catchErrors((req: Request, res: Response) => {
  const input = parseCreate(req.body);

  if (input.parentId != null) {
    const parent = findTaskById(input.parentId);
    if (!parent) {
      throw new AppError(404, `Parent task ${input.parentId} not found`);
    }
    if (parent.parentId !== null) {
      throw new AppError(400, "Subtasks cannot have their own subtasks");
    }
  }

  const task = insertTask(input);
  res.status(201).json({ task });
});

export const updateTask = catchErrors((req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const input = parseUpdate(req.body);
  const result = updateTaskInput(id, input);
  if (!result) {
    throw new AppError(404, `Task ${id} not found`);
  }
  res.json({ task: result.task, affected: result.affected });
});

export const deleteTaskById = catchErrors((req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const result = deleteTask(id);
  if (!result) {
    throw new AppError(404, `Task ${id} not found`);
  }
  // 204 forbids a body, so return 200 with the deleted ids instead.
  res.json({ id: result.id, deletedIds: result.deletedIds });
});
