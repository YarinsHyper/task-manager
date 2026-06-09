import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/tasks", (_req, res) => {
  res.json({
    message:
      "Task API placeholder. Implement task listing, filtering, and sorting here.",
    tasks: []
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

