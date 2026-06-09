# Mini Task Prioritizer

This is a starter project for a small full-stack home assignment.

Your goal is to build a task prioritizer where a user can create, view, update, delete, filter, and sort tasks.

You may use Google, documentation, ChatGPT, or any other tools. We care less about memorized syntax and more about how you think, structure your code, and explain your decisions.

## Tech Stack

- Frontend: React with Vite and TypeScript
- Backend: Node.js with Express and TypeScript
- Data: In-memory only, no database required

## Project Structure

```text
client/
  React + Vite frontend

server/
  Express API backend
```

The frontend and backend are separate apps with separate dependencies and commands.

## Getting Started

Install and run the backend:

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

Install and run the frontend in a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on Vite's local dev server. API requests to `/api` are proxied to the backend.

## Product Requirements

Build a simple task prioritizer.

Each task should have:

- `id`
- `title`
- `priority`: `low`, `medium`, or `high`
- `status`: `todo` or `done`
- `createdAt`

## Backend Requirements

Create a small REST API.

### `GET /api/tasks`

Returns all tasks.

Support optional query params:

- `status=todo|done`
- `priority=low|medium|high`
- `sort=priority|createdAt`

Example:

```http
GET /api/tasks?status=todo&sort=priority
```

### `POST /api/tasks`

Creates a new task.

Request body:

```json
{
  "title": "Book doctor appointment",
  "priority": "high"
}
```

Validation rules:

- `title` is required
- `title` cannot be empty
- `priority` must be one of `low`, `medium`, `high`
- Default `status` should be `todo`

### `PATCH /api/tasks/:id`

Updates a task.

Should support changing:

- `title`
- `priority`
- `status`

### `DELETE /api/tasks/:id`

Deletes a task.

## Frontend Requirements

Create a React UI that allows the user to:

- See all tasks
- Add a new task
- Mark a task as done or todo
- Delete a task
- Filter by status
- Filter by priority
- Sort by priority or creation time

The UI does not need to be beautiful, but it should be clear and usable.

## Important Logic Requirement

Priority sorting should be logical, not alphabetical.

For example, `high` should sort above `medium`, and `medium` should sort above `low`.

## What We Look For

- Clear, readable code
- Reasonable API design
- Good validation and error handling
- Thoughtful React state management
- A usable UI
- Practical tradeoffs and explanations

