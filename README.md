# Taskr — Full Stack TODO App

A clean, modern TODO application built with React, Express, and MongoDB.

## Project Structure

```
hiring-fullstack-todo/
├── client/          # React frontend
│   ├── README.md
│   └── src/
│       ├── components/   # UI components
│       ├── hooks/        # useTodos custom hook
│       └── services/     # API service layer
├── server/          # Express backend
│   ├── README.md
│   └── src/
│       ├── config/       # DB connection
│       ├── middleware/   # Error handler
│       ├── models/       # Mongoose Todo model
│       └── routes/       # REST API routes
└── README.md
```

## Quick Start

### 1. Start the backend
```bash
cd server
npm install
cp .env.  
npm run dev
```

### 2. Start the frontend
```bash
cd client
npm install
npm start
```

Visit `http://localhost:3000`

## Tech Stack
| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, CSS Modules   |
| Backend   | Node.js, Express.js     |
| Database  | MongoDB + Mongoose      |

## API Endpoints

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/todos          | Get all todos       |
| POST   | /api/todos          | Create a todo       |
| PUT    | /api/todos/:id      | Update title/desc   |
| PATCH  | /api/todos/:id/done | Toggle done status  |
| DELETE | /api/todos/:id      | Delete a todo       |

## Key Design Decisions
- **Optimistic UI** — The UI updates instantly before the server confirms, making interactions feel snappy. On failure, the state is rolled back.
- **CSS Modules** — Scoped styles per component; no class name collisions.
- **Custom hook** (`useTodos`) — All data-fetching and mutation logic is isolated, keeping components clean.
- **Error handling** — Both loading and error states are handled gracefully throughout.
- **Form validation** — Client-side validation with clear inline error messages.
