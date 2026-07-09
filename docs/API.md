# API Reference

Base URL: `/api`

All protected endpoints require a valid `auth_token` cookie or `Authorization: Bearer <token>` header.

## Auth

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a team member |
| `POST` | `/auth/login` | Public | Login and set auth cookie |
| `POST` | `/auth/logout` | Public | Clear auth cookie |

## Users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/users/profile` | Authenticated | Get current user profile |
| `PATCH` | `/users/password` | Authenticated | Change own password |
| `GET` | `/users` | Manager | List users |
| `POST` | `/users` | Manager | Create user |
| `GET` | `/users/team-members` | Manager | List team members for assignment |
| `GET` | `/users/manager-dashboard` | Manager | Verify manager dashboard access |

## Projects

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/projects` | Manager | List all projects, with optional filters |
| `GET` | `/projects/my-projects` | Authenticated | List projects visible to current member |
| `POST` | `/projects` | Manager | Create project |
| `PUT` | `/projects/:id` | Manager | Update project |
| `DELETE` | `/projects/:id` | Manager | Delete project |
| `POST` | `/projects/:id/members` | Manager | Assign team member to project |
| `GET` | `/projects/:id/members` | Manager | List project members |

## Tasks

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/tasks` | Manager | List all tasks, with optional filters |
| `GET` | `/tasks/my-tasks` | Authenticated | List current member's tasks |
| `GET` | `/tasks/:id` | Manager or owning member | Get task details |
| `PATCH` | `/tasks/:id/status` | Owning member | Update own task status |
| `POST` | `/tasks` | Manager | Create task |
| `PUT` | `/tasks/:id` | Manager | Update task |
| `DELETE` | `/tasks/:id` | Manager | Delete task |

## Weekly Reports

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/reports/manager/all` | Manager | List team reports |
| `GET` | `/reports/manager/:id` | Manager | View any team report |
| `PATCH` | `/reports/manager/:id/blocker/resolve` | Manager | Resolve a report blocker |
| `POST` | `/reports` | Team member | Create own draft report |
| `GET` | `/reports/my` | Authenticated | List own reports |
| `GET` | `/reports/my/:id` | Authenticated | View own report |
| `PUT` | `/reports/:id` | Team member | Update own draft report |
| `POST` | `/reports/:id/submit` | Team member | Submit own report |

## Dashboard

All dashboard endpoints are manager-only.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/dashboard/summary` | Submission and blocker summary |
| `GET` | `/dashboard/submission-status` | Per-member submission status |
| `GET` | `/dashboard/project-distribution` | Project task distribution |
| `GET` | `/dashboard/tasks-trend` | Weekly completed task trend |
| `GET` | `/dashboard/recent-activity` | Recent report activity |

## Notifications

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/notifications` | Authenticated | List current user's notifications |
| `PATCH` | `/notifications/read` | Authenticated | Mark current user's notifications as read |

## AI Assistant

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/assistant/chat` | Authenticated | Ask a role-scoped question about system data |

The assistant endpoint sends only role-scoped context to the LLM. Managers receive team context; team members receive only their own reports, tasks, projects, and workload context.
