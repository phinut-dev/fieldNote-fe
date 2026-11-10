import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../utils/auth";
import { api } from "../utils/api";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const { accessToken, user } = await api("/auth/login", {
        method: "POST",
        body: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      });
      if (!accessToken || !USER_ROLES.includes(user?.role)) {
        throw new Error("The login response from the server is invalid.");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to connect to the server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen bg-dark-surface-active flex justify-center items-center">
      <div className="bg-canvas rounded-xl px-14 py-10">
        <header className="pb-7">
          <strong className="text-2xl">
            Field<span className="text-brand-hover">Note</span>
          </strong>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              className="border border-muted rounded-lg p-2 outline-dark-surface-active focus:border-dark-surface-active"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="border border-muted rounded-lg p-2 outline-dark-surface-active focus:border-dark-surface-active"
            />
          </div>
          {error && (
            <p className="mt-3 text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-dark-surface-active px-8 py-2 rounded-lg text-white mt-5 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
