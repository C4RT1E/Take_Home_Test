# Todo Tracker — Backend API

Express + Sequelize + SQLite REST API serving the Todo Tracker application.

## Tech Stack
- Node.js (ECMAScript ESM)
- Express.js
- Sequelize ORM
- SQLite (File-based database)

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run database migrations
npx sequelize-cli db:migrate

# 3. Start development server
npm run dev
```

Server listens on `http://localhost:5001`.

## API Endpoints

- `GET /todos` — List all todos
- `POST /todos` — Create a new todo (`title` required, `description` optional)
- `PUT /todos/:id` — Update a todo (`title`, `description`, `completed`)
- `DELETE /todos/:id` — Delete a todo by ID
