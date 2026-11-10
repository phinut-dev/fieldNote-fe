import { Link } from "react-router-dom";
import TaskBadges from "./TaskBadges";

function CardTask({
  id,
  title,
  location,
  priority,
  deadline,
  status,
  assignedToName,
}) {
  const dueDate = deadline
    ? new Date(`${deadline.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US")
    : "No due date";

  return (
    <Link
      to={`/tasks/${id}`}
      className="grid rounded-xl border border-line bg-surface p-6 transition-colors hover:border-brand"
    >
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{location} · {dueDate}</p>
      {assignedToName && (
        <p className="mt-2 text-sm text-muted">Assigned to: {assignedToName}</p>
      )}
      <div className="mt-3">
        <TaskBadges status={status} priority={priority} />
      </div>
    </Link>
  );
}

export default CardTask;
