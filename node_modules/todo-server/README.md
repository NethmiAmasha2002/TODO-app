# TODO App — Backend

Express.js REST API backed by MongoDB.

## Setup & Run

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your MongoDB URI.

### 3. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

## MongoDB Connection

**Local:** `MONGODB_URI=mongodb://localhost:27017/todo-app`

**Atlas (cloud):** Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas), then use:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/todo-app
```

## API Endpoints

| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| GET    | /api/todos             | Get all todos       |
| POST   | /api/todos             | Create a todo       |
| PUT    | /api/todos/:id         | Update title/desc   |
| PATCH  | /api/todos/:id/done    | Toggle done status  |
| DELETE | /api/todos/:id         | Delete a todo       |

## Assumptions & Limitations
- No authentication (single-user app)
- Todos are sorted newest-first
- Title max 200 chars, description max 1000 chars
