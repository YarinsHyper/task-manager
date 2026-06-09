import cors from "cors";
import express from "express";
import "./db/index.js";
import { TaskModel } from "./models/task.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/tasks", (_req, res) => {
  res.json({ tasks: TaskModel.findAll() });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

