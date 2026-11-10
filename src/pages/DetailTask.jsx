import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import TaskBadges from "../components/TaskBadges";
import { api } from "../utils/api";
import { getCurrentUser } from "../utils/auth";

const TASK_STATUSES = [
  "draft",
  "assigned",
  "on progress",
  "submitted",
  "completed",
  "cancelled",
];

function DetailTask() {
  const { id } = useParams();
  const role = getCurrentUser()?.role;
  const isAdmin = role === "admin";
  const isFieldWorker = role === "field_worker";
  const canUpdateStatus = ["admin", "supervisor", "field_worker"].includes(role);
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTask() {
      try {
        const result = isAdmin
          ? await api(`/task/${encodeURIComponent(id)}`)
          : (await api("/task/user")).find(
              (item) => String(item.id) === String(id),
            );
        if (!result || typeof result !== "object") {
          throw new Error("The task details response has an invalid format.");
        }
        if (active) setTask(result);
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

    loadTask();
    return () => {
      active = false;
    };
  }, [id, isAdmin]);

  function handleStatusChange(e) {
    setPendingStatus(e.target.value);
  }

  async function confirmStatusChange() {
    if (!pendingStatus) return;
    setError("");
    setIsSaving(true);

    try {
      await api(`/task/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        body: { status: pendingStatus },
      });
      setTask((current) => ({ ...current, status: pendingStatus }));
      setPendingStatus("");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update task status.",
      );
      setPendingStatus("");
    } finally {
      setIsSaving(false);
    }
  }

  const dueDate = task?.due_date
    ? new Date(`${String(task.due_date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US")
    : "No due date";

  if (isLoading) {
    return (
      <main aria-busy="true" className="mx-auto max-w-5xl">
        <span className="sr-only">Loading task details...</span>
        <header className="mb-7 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </header>
        <section className="mb-5 space-y-5 rounded-2xl border border-line bg-surface p-6">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </section>
        <section className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <Skeleton className="h-5 w-32" />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }
  if (!task) {
    return (
      <>
        <Header title="Task not found" desc="Unable to load task details." />
        <p className="text-sm text-red-600" role="alert">{error}</p>
        <Link to="/tasks" className="mt-4 inline-block text-brand underline">Back to tasks</Link>
      </>
    );
  }

  const isFieldWorkerStatusLocked =
    isFieldWorker && task.status?.toLowerCase() === "completed";

  return (
    <main className="mx-auto max-w-5xl">
      <Header
        back={<Link to="/tasks">← Back to tasks</Link>}
        title={task.title}
        desc={task.location}
      />
      {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
      <section className="mb-5 rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <TaskBadges status={task.status} priority={task.priority} />
          {canUpdateStatus && !isFieldWorkerStatusLocked && (
            <label className="flex items-center gap-2 text-sm text-muted">
              Update status
              <select
                value={task.status}
                disabled={isSaving}
                onChange={handleStatusChange}
                className="rounded-lg border border-line bg-surface p-2 text-ink disabled:opacity-60"
              >
                {[
                  ...(isFieldWorker && !["on progress", "submitted"].includes(task.status)
                    ? [task.status]
                    : []),
                  ...(isFieldWorker
                    ? ["on progress", "submitted"]
                    : TASK_STATUSES),
                ].filter((status, index, statuses) => statuses.indexOf(status) === index).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <h2 className="mb-3 font-semibold text-ink">Description</h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
          {task.description || "No description provided."}
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-ink">Task details</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <DetailItem label="Assigned to" value={task.assigned_to_name} />
          <DetailItem label="Due date" value={dueDate} />
          <DetailItem label="Created by" value={task.created_by_name} />
          <DetailItem label="Created at" value={task.created_at} />
          <DetailItem label="Updated at" value={task.updated_at} />
        </div>
      </section>
      <ConfirmModal
        isOpen={Boolean(pendingStatus)}
        title="Change task status?"
        message={`Change status to "${pendingStatus}"?`}
        confirmLabel="Change status"
        isLoading={isSaving}
        onCancel={() => setPendingStatus("")}
        onConfirm={confirmStatusChange}
      />
    </main>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="text-sm font-medium text-ink">{value || "-"}</p>
    </div>
  );
}

export default DetailTask;
