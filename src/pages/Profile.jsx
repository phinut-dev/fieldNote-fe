import Header from "../components/Header";
import { getCurrentUser } from "../utils/auth";

function Profile() {
  const user = getCurrentUser();
  const initials = (user?.name || user?.email || "FN")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <>
      <Header title="Profile" desc="Your account information" />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="border-b border-line p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-xl font-semibold text-brand">{initials}</span>
              <div>
                <h2 className="text-xl font-semibold text-ink">{user?.name || "FieldNote user"}</h2>
                <p className="mt-1 text-sm text-muted">{user?.email || "Email not available"}</p>
                <span className="mt-2 inline-flex rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium capitalize text-brand">{user?.role?.replaceAll("_", " ") || "Account"}</span>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-ink">Account information</h3>
              <p className="mt-1 text-sm text-muted">Your profile and access details.</p>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              <ProfileField label="Full name" value={user?.name} />
              <ProfileField label="Email address" value={user?.email} />
              <ProfileField label="Role" value={user?.role?.replaceAll("_", " ")} />
              <ProfileField label="Account status" value={user?.status || "Active"} />
            </div>
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-lg text-brand" aria-hidden="true">✓</div>
          <h3 className="mt-4 font-semibold text-ink">Your account is protected</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Your account information is used to manage access and activity in FieldNote.
          </p>
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Access level</p>
            <p className="mt-1 text-sm font-medium capitalize text-ink">{user?.role?.replaceAll("_", " ") || "FieldNote account"}</p>
          </div>
        </aside>
      </div>
    </>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b border-line py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1.5 font-medium capitalize text-ink">{value || "-"}</p>
    </div>
  );
}

export default Profile;