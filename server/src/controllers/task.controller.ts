import type { Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { catchErrors } from "../middleware/catch-errors.js";
import { deleteTask, findAllTasks, insertTask, updateTaskInput } from "../models/task.model.js";
import { parseCreate, parseId, parseUpdate } from "../validators/task.validator.js";

export const getAllTasks = catchErrors((_req: Request, res: Response) => {
  const tasks = findAllTasks();
  res.json({ tasks });
});

export const createTask = catchErrors((req: Request, res: Response) => {
  const input = parseCreate(req.body);
  const task = insertTask(input);
  res.status(201).json({ task });
});

export const updateTask = catchErrors((req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const input = parseUpdate(req.body);
  const task = updateTaskInput(id, input);
  if (!task) {
    throw new AppError(404, `Task ${id} not found`);
  }
  res.json({ task });
});

export const deleteTaskById = catchErrors((req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const deleted = deleteTask(id);
  if (!deleted) {
    throw new AppError(404, `Task ${id} not found`);
  }
  // 204 forbids a body, so return 200 with the deleted id instead.
  res.json({ id });
});
