# Weekly Report System

Full-stack weekly report and team dashboard system for managers and team members. The application supports role-based access, project/task management, structured weekly reports, blocker tracking, notifications, manager analytics, and an AI chat assistant.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Chart.js
- Backend: Node.js, Express, MySQL, JWT, bcrypt, express-validator
- AI assistant: Gemini API called only from the backend

## Core Features

- Authentication with HTTP-only JWT cookie support
- Role-based UI and API access for `MANAGER` and `TEAM_MEMBER`
- Manager dashboard with submission status, project distribution, task trends, recent activity, and open blockers
- Project creation, editing, member assignment, and status management
- Task creation, assignment, update, deletion, filtering, and member task status updates
- Weekly report drafts/submission with completed tasks, planned tasks, manual tasks, hours, notes, and blockers
- Blocker resolution workflow with notifications
- Role-scoped AI assistant for reports, tasks, projects, blockers, workload, and submissions

## Architecture

The backend uses a route-controller-service structure:

- `routes`: maps API endpoints and applies authentication/authorization middleware
- `controllers`: handles HTTP request/response behavior
- `services`: contains database queries and business rules
- `validators`: validates request payloads with `express-validator`
- `middleware`: authentication, authorization, and error handling

The frontend is organized by reusable pieces:

- `pages`: role-specific screens for managers, members, auth, and profile
- `components`: reusable layout, common UI, reports, tasks, projects, dashboard, and assistant components
- `api`: typed-by-convention API wrappers around Axios
- `context` and `hooks`: authentication state and access helpers

## Role-Based Access Control

The API enforces RBAC on protected routes:

- Managers can view team-wide dashboards, reports, users, projects, and tasks.
- Members can view only their assigned projects, own tasks, own reports, and own notifications.
- Manager-only list endpoints such as `/api/projects` and `/api/tasks` require the `MANAGER` role.
- Member task detail and status updates are scoped to `req.user.id`.
- Weekly report creation/update validates that selected projects and task IDs belong to the current member.
- The AI assistant builds context according to the authenticated user's role.

See [`docs/API.md`](docs/API.md) for endpoint-level access rules.

## Database

The schema is available in [`database/schema.sql`](database/schema.sql). Main tables:

- `users`
- `projects`
- `project_members`
- `tasks`
- `weekly_reports`
- `weekly_report_tasks`
- `notifications`

The schema includes foreign keys, cascade rules, unique constraints, and indexes for role filtering, report weeks, task status/deadlines, project membership, and notifications.

## Setup

1. Install dependencies:

```bash
cd backend
npm install

cd ../client
npm install
```

2. Create the database:

```bash
mysql -u root -p < database/schema.sql
```

3. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

4. Start the backend:

```bash
cd backend
npm run dev
```

5. Start the frontend:

```bash
cd client
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Important Environment Variables

Backend:

- `PORT`
- `CLIENT_URL`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Frontend:

- `VITE_API_BASE_URL`

## AI Chat Assistant

Authenticated users see a floating AI assistant on dashboard pages. The browser sends questions to `/api/assistant/chat`; the Gemini API key stays in the backend. The backend builds a compact role-scoped context from reports, tasks, projects, blockers, workload, and dashboard data.

Privacy and safety behavior:

- Managers receive team-wide context.
- Team members receive only their own relevant context.
- The assistant refuses unrelated questions.
- The model is instructed to use only provided system data and avoid inventing missing details.

## Quality Checks

Frontend:

```bash
cd client
npm run lint
npm run build
```

Backend syntax check:

```bash
cd backend
node --check src/server.js
```

