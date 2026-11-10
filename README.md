# FieldNote

FieldNote is a field-work task management app. This repository contains the React frontend, integrated with the [FieldNote Backend](https://github.com/phinut-dev/fieldNote-be)
Express API. The backend is deployed at
[`field-note-be.vercel.app`](https://field-note-be.vercel.app/).
The frontend is deployed at
[`field-note-fe.vercel.app`](https://field-note-fe.vercel.app/dashboard).

## Features

- Sign in with the backend and use the returned Bearer access token for API calls.
- View a task dashboard and task list, with search and status filters.
- View task details, assignee and creator names, due date, priority, and status.
- Create tasks and confirm before saving.
- Confirm task status changes before submitting them.
- Show status and priority badges with distinct colors.
- Show loading skeletons while task, user, and dashboard data loads.
- View the user list and profile.
- Enforce page access in the frontend based on the signed-in role.

The Reports page is a placeholder because the backend does not currently provide
a reports endpoint.

## Roles and task access

| Role         | Dashboard, tasks, profile | Create task | Update task status                                        | User list |
| ------------ | ------------------------- | ----------- | --------------------------------------------------------- | --------- |
| Admin        | All tasks                 | Yes         | Any supported status                                      | Yes       |
| Supervisor   | Assigned tasks            | Yes         | Any supported status                                      | No        |
| Field worker | Assigned tasks            | No          | Assigned tasks can be set to `on progress` or `submitted` | No        |

Completed tasks do not show the status control to field workers. The backend is
the source of truth for authorization; frontend route guards are not a security
boundary.

## Tech stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Express 5 API with MySQL

## Requirements

- Node.js compatible with the installed Vite version
- npm
- MySQL for the backend

## Run locally

Start and configure the backend first. From the backend project directory:

```bash
npm install
npm start
```

Configure its `.env` with the required database settings (`DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD`, `DB_NAME`) and `JWT_SECRET`.

Then, from this frontend project directory:

```bash
npm install
cp .env.example .env
npm run dev
```

The example `.env` uses the deployed backend at
`https://field-note-be.vercel.app/api/v1`. To use a local backend, change
`VITE_API_BASE_URL` in `.env` to `http://localhost:3000/api/v1`. You can also
set it to any other backend URL. Restart the Vite dev server after changing it.
Do not commit `.env` files or secrets.

## Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run lint`    | Run ESLint                           |
| `npm run build`   | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## API integration

The frontend uses the backend response envelope `{ status, message, data }`.
Authenticated requests include `Authorization: Bearer <accessToken>`.

| Feature                            | Method and endpoint                    |
| ---------------------------------- | -------------------------------------- |
| Login                              | `POST /api/v1/auth/login`              |
| Admin task list                    | `GET /api/v1/task`                     |
| Tasks assigned to the current user | `GET /api/v1/task/user`                |
| Task details for admin             | `GET /api/v1/task/:id`                 |
| Create a task                      | `POST /api/v1/task`                    |
| Update task status                 | `PATCH /api/v1/task/:id/status`        |
| Assignable workers                 | `GET /api/v1/users/assignable-workers` |
| Admin user list                    | `GET /api/v1/users`                    |

The backend currently requires a due date when creating a task, so provide one
even though the frontend form does not mark the field as required.

## Current limitations

- Reports are not connected to an API.
- The frontend currently displays the user list but does not create, edit, or
  deactivate users.
- Task editing and password management are not available in the frontend.
- The backend task update, user update, and password reset endpoints are
  currently unimplemented.
