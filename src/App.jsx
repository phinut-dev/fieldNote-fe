import "./App.css";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import DetailTask from "./pages/DetailTask";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import CreateTask from "./pages/CreateTask";
import Profile from "./pages/Profile";
import {
  getCurrentUser,
  hasAccessToPage,
  isAuthenticated,
} from "./utils/auth";

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

function PageAccessRoute({ page }) {
  const user = getCurrentUser();

  if (!hasAccessToPage(page, user?.role)) {
    return (
      <section
        className="rounded-xl border border-line bg-surface p-6"
        role="alert"
      >
        <h1 className="text-xl font-semibold text-ink">Access denied</h1>
        <p className="mt-2 text-muted">
          Your account role does not have permission to view this page.
        </p>
        <Link className="mt-4 inline-block text-brand underline" to="/dashboard">
          Back to Dashboard
        </Link>
      </section>
    );
  }

  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route element={<PageAccessRoute page="dashboard" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<PageAccessRoute page="tasks" />}>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<DetailTask />} />
          </Route>
          <Route element={<PageAccessRoute page="createTask" />}>
            <Route path="/tasks/create" element={<CreateTask />} />
          </Route>
          <Route element={<PageAccessRoute page="reports" />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route element={<PageAccessRoute page="users" />}>
            <Route path="/users" element={<Users />} />
          </Route>
          <Route element={<PageAccessRoute page="profile" />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
