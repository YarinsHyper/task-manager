import cors from "cors";
import express from "express";
import createTaskRouter from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { burstLimiter, sustainedLimiter } from "./middleware/rate-limit.js";
import { requestLogger } from "./middleware/request-logger.js";
import "./db/index.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", burstLimiter, sustainedLimiter, createTaskRouter());

// Must be last: only errors from handlers registered before this point
// reach it.
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Without this, a startup failure (e.g. the port already in use) surfaces
// as an unhandled 'error' event and an unclear crash instead of a message.
server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
