import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import { api } from "../utils/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const result = await api("/users");
        if (!Array.isArray(result)) {
          throw new Error("The user list response has an invalid format.");
        }
        if (active) setUsers(result);
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

    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery = [user.name, user.email].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );
      return matchesQuery && (!role || user.role === role);
    });
  }, [role, search, users]);

  const activeUsers = users.filter((user) => user.status === "active").length;
  const workers = users.filter((user) => user.role === "field_worker").length;

  return (
    <>
      <Header title="Users" desc="Manage system users" />
      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <section aria-busy={isLoading} className="mb-6 grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <span className="sr-only">Loading user summary...</span>
            <UserStatSkeleton />
            <UserStatSkeleton />
            <UserStatSkeleton />
          </>
        ) : (
          <>
            <UserStat
              label="Total users"
              value={users.length}
              detail="All registered accounts"
            />
            <UserStat
              label="Active users"
              value={activeUsers}
              detail="Accounts currently active"
            />
            <UserStat
              label="Field workers"
              value={workers}
              detail="Users with the field worker role"
            />
          </>
        )}
      </section>
      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">All users</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              aria-label="Search users"
              className="min-w-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand sm:w-56"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Filter user role"
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="field_worker">Field worker</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-canvas/70 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading
                ? Array.from({ length: 5 }, (_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td className="px-5 py-4">
                        <Skeleton className="h-10 w-48" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                    </tr>
                  ))
                : visibleUsers.map((user) => {
                    const initials = (user.name || user.email || "?")
                      .split(/[\s@.]+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0].toUpperCase())
                      .join("");

                    return (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-canvas/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                              {initials}
                            </span>
                            <span>
                              <span className="block font-medium text-ink">
                                {user.name}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted">
                                {user.email}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 capitalize text-ink">
                          {user.role?.replaceAll("_", " ")}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${user.status === "active" ? "bg-emerald-500/10 text-emerald-700" : "bg-slate-500/10 text-muted"}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {!isLoading && !error && visibleUsers.length === 0 && (
          <p className="p-5 text-sm text-muted">No matching users found.</p>
        )}
      </section>
    </>
  );
}

function UserStatSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="space-y-3 rounded-xl border border-line bg-surface p-5"
    >
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-3 w-3/4" />
    </article>
  );
}

function UserStat({ label, value, detail }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
    </article>
  );
}

export default Users;
