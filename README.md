# Mini Task Prioritizer

This is a starter project for a small full-stack home assignment.

Your goal is to build a task manager that displays tasks from the database in a sortable table.

You may use Google, documentation, ChatGPT, or any other tools. We care less about memorized syntax and more about how you think, structure your code, and explain your decisions.

## Tech Stack

- Frontend: React with Vite and TypeScript
- Backend: Node.js with Express and TypeScript
- Data: SQLite (local file at `server/data/tasks.db`)

## Project Structure

```text
client/
  React + Vite frontend

server/
  Express API backend with SQLite
```

The frontend and backend are separate apps with separate dependencies and commands.

## Getting Started

From the project root, install dependencies and run both apps:

```bash
npm run install:all
npm run dev
```

The frontend proxies API requests to `/api` on the backend.

## Requirements

Tasks are based on the starter `tasks` table:

- `id`
- `title`
- `priority`: `low`, `medium`, or `high`
- `status`: `todo` or `done`
- `createdAt`

Build a React UI that:

- Shows tasks in a **table**
- Lets the user **sort by any column**
- Lets the user **add a new task**
- Lets the user **mark a task as done or todo**
- Lets the user **filter by status**
- Lets the user **filter by priority**
- Lets the user **delete a row**

The UI does not need to be beautiful, but it should be clear and usable.

## Backend

The server includes a starter SQLite setup and a `tasks` table model. **You have full control over the API** — design your own endpoints, request/response shapes, and validation rules however you think is best.

You are also free to **change the database schema and task model** if your design calls for it. The starter table is a suggestion, not a requirement.

## What We Look For

- Clear, simple ,readable code
- Reasonable API design
- Good validation and error handling
- Thoughtful React state management
- A usable UI
- Practical tradeoffs and explanations

