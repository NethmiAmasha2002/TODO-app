# TODO App — Frontend

React.js single-page application for the TODO app.

## Setup & Run

### 1. Install dependencies
```bash
cd client
npm install
```

### 2. Configure environment (optional)
By default the app proxies API calls to `http://localhost:5000`.
To override, create `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the development server
```bash
npm start
```

App runs at `http://localhost:3000`

### 4. Build for production
```bash
npm run build
```

## Features
- View, create, edit, delete todos
- Mark as done/undone with optimistic UI updates
- Filter by All / Active / Done
- Progress bar showing completion rate
- Loading skeletons & error states
- Toast notifications for feedback
- Responsive design (mobile + desktop)
- Smooth animations and transitions

## Assumptions & Limitations
- Requires the backend server running on port 5000
- No authentication (single-user)
- No offline support
