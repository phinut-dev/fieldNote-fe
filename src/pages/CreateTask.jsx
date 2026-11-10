import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import { api } from "../utils/api";

function CreateTask() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [workersError, setWorkersError] = useState("");
  const [error, setError] = useState("");
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);

  useEffect(() => {
    async function loadWorkers() {
      try {
        const workers = await api("/users/assignable-workers");
        if (!Array.isArray(workers)) {
          throw new Error("The worker list response has an invalid format.");
        }

        setWorkers(workers);
      } catch (loadError) {
        setWorkersError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to connect to the server.",
        );
      } finally {
        setIsLoadingWorkers(false);
      }
    }

    loadWorkers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const dueDate = formData.get("due_date");
    setPendingTask({
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      priority: formData.get("priority"),
      assigned_to: Number(formData.get("assigned_to")),
      assigned_to_name: workers.find(
        (worker) => Number(worker.id) === Number(formData.get("assigned_to")),
      )?.name,
      due_date: dueDate || null,
    });
  }

  async function confirmCreateTask() {
    if (!pendingTask) return;
    setIsSubmitting(true);
    try {
      await api("/task", {
        method: "POST",
        body: pendingTask,
      });

      navigate("/tasks");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to connect to the server.",
      );
      setPendingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header title="Create Task" desc="Create a new task for a field worker." />
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
      >
        <div className="border-b border-line px-6 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-ink">Task information</h2>
          <p className="mt-1 text-sm text-muted">
            Add the task details and choose who will complete it.
          </p>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2">
            <FormField label="Task title" name="title" required />
          </div>
          <div className="sm:col-span-2">
            <label className="block space-y-1.5 text-sm text-muted">
              <span className="font-medium text-ink">Description</span>
              <textarea
                name="description"
                rows="4"
                placeholder="Add task details..."
                className="w-full rounded-lg border border-line bg-surface p-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </label>
          </div>
          <FormField label="Location" name="location" required />
          <label className="block space-y-1.5 text-sm text-muted">
            <span className="font-medium text-ink">Priority</span>
            <select
              name="priority"
              required
              className="w-full rounded-lg border border-line bg-surface p-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
            >
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="block space-y-1.5 text-sm text-muted">
            <span className="font-medium text-ink">Assign to</span>
            <select
              name="assigned_to"
              required
              disabled={isLoadingWorkers || workers.length === 0}
              className="w-full rounded-lg border border-line bg-surface p-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-60"
            >
              <option value="">
                {isLoadingWorkers ? "Loading workers..." : "Select a worker"}
              </option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </label>
          <FormField label="Due date" name="due_date" type="date" />
          {(workersError || error) && (
            <div className="space-y-2 sm:col-span-2">
              {workersError && (
                <p className="text-sm text-red-600" role="alert">
                  {workersError}
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-line bg-canvas/50 px-6 py-4 sm:flex-row sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingWorkers || workers.length === 0}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save task"}
          </button>
        </div>
      </form>
      <ConfirmModal
        isOpen={Boolean(pendingTask)}
        title="Create this task?"
        message={
          pendingTask
            ? `Create "${pendingTask.title}"?`
            : ""
        }
        confirmLabel="Create task"
        isLoading={isSubmitting}
        onCancel={() => setPendingTask(null)}
        onConfirm={confirmCreateTask}
      />
    </>
  );
}

function FormField({ label, name, type = "text", required = false }) {
  return (
    <label className="block space-y-1.5 text-sm text-muted">
      <span className="font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={label === "Task title" ? "e.g. Inspect the irrigation channel" : ""}
        className="w-full rounded-lg border border-line bg-surface p-3 text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

export default CreateTask;