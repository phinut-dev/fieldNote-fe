import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CardTask from "../components/CardTask";
import Header from "../components/Header";
import { TaskCardSkeleton } from "../components/Skeleton";
import { api } from "../utils/api";
import { getCurrentUser } from "../utils/auth";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const role = getCurrentUser()?.role;
  const isAdmin = role === "admin";
  const canCreateTask = isAdmin || role === "supervisor";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const result = await api(isAdmin ? "/task" : "/task/user");
        if (!Array.isArray(result)) {
          throw new Error("The task list response has an invalid format.");
        }
        if (active) setTasks(result);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to connect to the server.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = [task.title, task.location, task.description]
        .some((value) => String(value ?? "").toLowerCase().includes(query));
      return matchesSearch && (!status || task.status === status);
    });
  }, [search, status, tasks]);

  return (
    <>
      <Header
        title="Tasks"
        desc="Browse and manage field tasks"
        action={
          canCreateTask && (
            <Link
              to="/tasks/create"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Add Task
            </Link>
          )
        }
      />
      <div aria-busy={isLoading} aria-live="polite">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className="min-w-0 flex-1 rounded-lg border border-line bg-white p-2.5"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter task status"
              className="rounded-lg border border-line bg-white p-2.5 text-ink sm:w-56"
            >
              <option value="">All statuses</option>
              {["draft", "assigned", "on progress", "submitted", "completed", "cancelled"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
          {isLoading ? (
            <>
              <span className="sr-only">Loading tasks...</span>
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <TaskCardSkeleton key={index} />
                ))}
              </section>
            </>
          ) : !error && visibleTasks.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface p-5 text-muted">
              No matching tasks found.
            </p>
          ) : (
            <section className="grid grid-cols-1 gap-5 text-ink sm:grid-cols-2">
              {visibleTasks.map((task) => (
                <CardTask
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  location={task.location}
                  priority={task.priority}
                  deadline={task.due_date}
                  status={task.status}
                  assignedToName={task.assigned_to_name}
                />
              ))}
            </section>
          )}
      </div>
    </>
  );
}

export default Tasks;
