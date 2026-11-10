import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, hasAccessToPage } from "../utils/auth";

const links = [
  { to: "/dashboard", label: "Dashboard", page: "dashboard" },
  { to: "/tasks", label: "Tasks", page: "tasks" },
  { to: "/reports", label: "Reports", page: "reports" },
  { to: "/users", label: "Users", page: "users" },
  { to: "/profile", label: "Profile", page: "profile" },
];

function AppLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="wrapper bg-canvas outfit-normal text-[17px]">
      <aside className="sidebar fixed flex flex-col left-0 top-0 h-screen bg-dark-surface text-on-dark-surface">
        <div className="brand text-2xl font-bold text-center">
          <span className="text-white">Field</span>
          <span className="text-brand">Note</span>
        </div>
        <nav className="flex flex-col mt-8 ubuntu-regular">
          {links
            .filter((link) => hasAccessToPage(link.page, user?.role))
            .map((link) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-2 rounded-md text-white bg-brand/30 transition-colors"
                    : "px-3 py-2 rounded-md text-on-dark-surface/75 hover:bg-brand/15 hover:text-white/80 transition-colors"
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="mt-auto flex flex-col">
          <strong className="text-lg">{user?.name ?? user?.email}</strong>
          <small className="text-on-dark-surface/75">
            {user?.role?.replaceAll("_", " ")}
          </small>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-brand text-white w-full mt-3"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="main ml-57.5 min-w-0 flex-1 ubuntu-regular">
        <header className="fixed w-full bg-surface/75 backdrop-blur-sm px-9 py-4 text-ink ">
          FieldNote / Workspace
        </header>
        <main className="py-6 px-9 mt-16 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
