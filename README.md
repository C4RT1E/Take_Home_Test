# Todo Tracker — Intern Take-Home Test

A full-stack **Todo Tracker** web application built with a decoupled architecture: an **Express.js + Sequelize + SQLite** REST API backend and a **Next.js (App Router) + Tailwind CSS + Framer Motion** frontend.

---

## 📸 Overview & Architecture

```
repo/
├── backend/    → Express + Sequelize + SQLite REST API
├── frontend/   → Next.js (App Router) Client
└── README.md   → Top-level instructions & design documentation
```

The application is split into two completely independent folders:
- **Backend API**: Stateless REST API built with Node.js ESM, Express, and Sequelize ORM managing SQLite database schema via migrations.
- **Frontend App**: Client application built with Next.js 15 (App Router), Tailwind CSS, Framer Motion for smooth micro-animations, and Lucide React icons.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Backend Setup & Run

Open a terminal window and navigate to `backend/`:

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npm run dev
```

The API server will start on **`http://localhost:5001`**.

> **Note**: Database migrations automatically initialize the SQLite database file at `backend/database.sqlite`.

---

### 2. Frontend Setup & Run

Open a separate terminal window and navigate to `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

The web application will start on **`http://localhost:3000`**.

---

## ⚙️ Environment Variables

Both folders contain pre-configured `.env.example` files:

### Backend (`backend/.env.example`)
```env
PORT=5001
NODE_ENV=development
DB_STORAGE=./database.sqlite
```

### Frontend (`frontend/.env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

To customize ports or API URLs, copy `.env.example` to `.env` in `backend/` and `.env.local` in `frontend/`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body | Success Response | Error Responses |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/todos` | List all todos | *None* | `200 OK` + array | `500 Internal Server Error` |
| `POST` | `/todos` | Create a todo | `{ "title": "...", "description": "..." }` | `201 Created` + object | `400 Bad Request` (missing/empty title), `500` |
| `PUT` | `/todos/:id` | Update a todo | `{ "title": "...", "description": "...", "completed": true }` | `200 OK` + updated object | `400` (invalid body), `404` (not found), `500` |
| `DELETE` | `/todos/:id` | Delete a todo | *None* | `204 No Content` | `404` (not found), `500` |

### Error Response Format
All errors return a consistent JSON shape:
```json
{
  "error": "Title is required and cannot be empty"
}
```

---

## 🧠 Key Design Decisions

1. **Sequelize Migrations over `sequelize.sync()`**:
   - Schema changes and database table creations are managed via explicit, version-controlled CLI migrations (`src/migrations/`).
   - Ensures deterministic database states across local, staging, and production environments.

2. **Centralized Express Error Middleware**:
   - Routes and controllers stay clean and thin without duplicate error handling boilerplate.
   - Any thrown exception in async controllers is forwarded via `next(err)` to `src/middleware/errorHandler.js`.

3. **Next.js App Router & Client-Side Fetching Strategy**:
   - Utilizes Next.js App Router structure (`app/layout.js`, `app/page.js`).
   - Main task dashboard is client-driven for instantaneous interactive feedback (search filtering, status tabs, animated list re-ordering).
   - Implemented optimistic updates for status toggles and deletions to deliver zero-latency feel.

4. **Micro-Animations & UI Aesthetics**:
   - Integrated Framer Motion for `AnimatePresence` entry/exit transitions.
   - Glassmorphic slate dark theme styled with Tailwind CSS for a premium visual aesthetic.

---

## 🔮 Possible Improvements & Future Extensions

- **Authentication & User Isolation**: Add JWT/OAuth2 authentication and link todos to individual `UserId` foreign keys.
- **Pagination & Infinite Scroll**: Introduce `page` and `limit` query parameters on `GET /todos` for scaling to thousands of tasks.
- **Optimistic Drag-and-Drop Reordering**: Allow users to drag tasks to re-prioritize order using `@hello-pangea/dnd`.
- **WebSocket / Server-Sent Events (SSE)**: Real-time sync across multiple active browser windows/devices.
- **Automated Testing Suite**: Integration testing using Jest/Supertest for backend APIs, and Playwright for E2E frontend verification.
