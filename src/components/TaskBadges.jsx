const statusStyles = {
  draft: "border-badge-status-draft bg-badge-status-draft-bg text-badge-status-draft",
  assigned: "border-badge-status-assigned bg-badge-status-assigned-bg text-badge-status-assigned",
  "on progress": "border-badge-status-on-progress bg-badge-status-on-progress-bg text-badge-status-on-progress",
  submitted: "border-badge-status-submitted bg-badge-status-submitted-bg text-badge-status-submitted",
  completed: "border-badge-status-completed bg-badge-status-completed-bg text-badge-status-completed",
  cancelled: "border-badge-status-cancelled bg-badge-status-cancelled-bg text-badge-status-cancelled",
};

const priorityStyles = {
  low: "border-badge-priority-low bg-badge-priority-low-bg text-badge-priority-low",
  medium: "border-badge-priority-medium bg-badge-priority-medium-bg text-badge-priority-medium",
  high: "border-badge-priority-high bg-badge-priority-high-bg text-badge-priority-high",
};

function TaskBadges({ status, priority }) {
  const normalizedStatus = String(status ?? "").toLowerCase();
  const normalizedPriority = String(priority ?? "").toLowerCase();

  return (
    <div className="flex flex-wrap gap-2">
      {status && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[normalizedStatus] || "border-badge-status-draft bg-badge-status-draft-bg text-badge-status-draft"}`}
        >
          <span className="size-2 rounded-full bg-current" />
          Status: {status}
        </span>
      )}
      {priority && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${priorityStyles[normalizedPriority] || "border-badge-priority-none bg-badge-priority-none-bg text-badge-priority-none"}`}
        >
          <span className="size-2 rounded-full bg-current" />
          Priority: {priority}
        </span>
      )}
    </div>
  );
}

export default TaskBadges;
