import { Router } from "express";
import {
  createTask,
  getAllTasks,
  deleteTaskById,
  updateTask,
} from "../controllers/task.controller.js";

export default function createTaskRouter(): Router {
  const router = Router();

  router.get("/", getAllTasks);
  router.post("/", createTask);
  router.patch("/:id", updateTask);
  router.delete("/:id", deleteTaskById);

  return router;
}
