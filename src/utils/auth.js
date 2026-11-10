export const USER_ROLES = ["admin", "supervisor", "field_worker"];

const pageRoles = {
  dashboard: USER_ROLES,
  tasks: USER_ROLES,
  createTask: ["admin", "supervisor"],
  reports: USER_ROLES,
  users: ["admin"],
  profile: USER_ROLES,
};

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return USER_ROLES.includes(user?.role) ? user : null;
  } catch {
    return null;
  }
}

export function hasAccessToPage(page, role) {
  return pageRoles[page]?.includes(role) ?? false;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("accessToken") && getCurrentUser());
}
