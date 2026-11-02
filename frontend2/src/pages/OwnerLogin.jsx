import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, Utensils } from "lucide-react";

const OWNER_LOGIN_URL = import.meta.env.VITE_OWNER_LOGIN_URL || "/owner-auth";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (localStorage.getItem("ownerToken")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(OWNER_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError("The login server returned an invalid response.");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      if (typeof data.token !== "string" || !data.token) {
        setError("The login server did not return an owner token.");
        return;
      }

      localStorage.setItem("ownerToken", data.token);
      window.location.assign("/dashboard");
    } catch {
      setError("Could not reach the owner login server on port 3000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-stone-900/5 sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
            <Utensils size={26} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Restaurant management
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900">Owner sign in</h1>
          <p className="mt-2 text-sm text-stone-500">Sign in to manage your restaurant.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="owner-email" className="mb-2 block text-sm font-medium text-stone-700">
              Email address
            </label>
            <input
              id="owner-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              placeholder="owner@example.com"
            />
          </div>

          <div>
            <label htmlFor="owner-password" className="mb-2 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="owner-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole size={18} aria-hidden="true" />
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-400">
          Authorized restaurant owners only
        </p>
      </section>
    </main>
  );
}
