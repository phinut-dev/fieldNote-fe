import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardTask from "../components/CardTask";
import Header from "../components/Header";
import Skeleton, { TaskCardSkeleton } from "../components/Skeleton";
import { api } from "../utils/api";
import { getCurrentUser } from "../utils/auth";

function Dashboard() {
  const user = getCurrentUser();
  const canCreateTask = ["admin", "supervisor"].includes(user?.role);
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
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

  const inProgressCount = tasks.filter((task) => task.status === "on progress").length;
  const reviewCount = tasks.filter((task) => task.status === "submitted").length;

  return (
    <>
      <Header
        title={`Hello, ${user?.name || "there"}!`}
        desc="Your field work at a glance."
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
      <>
          {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
          <section aria-busy={isLoading} className="mb-7 grid grid-cols-1 gap-4 text-ink sm:grid-cols-3">
            {isLoading ? (
              <>
                <span className="sr-only">Loading task summary...</span>
                <DashboardStatSkeleton />
                <DashboardStatSkeleton />
                <DashboardStatSkeleton />
              </>
            ) : (
              <>
                <DashboardStat label="Total tasks" value={tasks.length} />
                <DashboardStat label="In progress" value={inProgressCount} />
                <DashboardStat label="Awaiting review" value={reviewCount} />
              </>
            )}
          </section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Recent tasks</h2>
            <Link to="/tasks" className="text-sm text-brand hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <section aria-busy="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <span className="sr-only">Loading tasks...</span>
              {Array.from({ length: 4 }, (_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </section>
          ) : !error && tasks.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface p-5 text-muted">
              No tasks yet.
            </p>
          ) : (
            <section className="grid grid-cols-1 gap-5 text-ink sm:grid-cols-2">
              {tasks.slice(0, 4).map((task) => (
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
      </>
    </>
  );
}

function DashboardStat({ label, value }) {
  return (
    <article className="grid rounded-xl border border-line bg-surface p-5">
      <span className="pb-3">{label}</span>
      <strong className="text-3xl">{value}</strong>
    </article>
  );
}

function DashboardStatSkeleton() {
  return (
    <article aria-hidden="true" className="grid gap-3 rounded-xl border border-line bg-surface p-5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-1/3" />
    </article>
  );
}

export default Dashboard;
