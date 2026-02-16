import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, hasSupabaseCredentials } from "../../lib/supabaseClient.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("sign-in");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    // Check if Supabase credentials are configured
    if (!hasSupabaseCredentials) {
      setStatus({
        loading: false,
        error: "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
      });
      return;
    }

    try {
      const { error } = await (
        mode === "sign-in"
          ? supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            })
          : supabase.auth.signUp({
              email: formData.email,
              password: formData.password
            })
      );

      if (error) {
        setStatus({ loading: false, error: error.message });
        return;
      }

      setStatus({ loading: false, error: "" });
      navigate("/admin");
    } catch (err) {
      // Handle unexpected errors (e.g., network issues, undefined client)
      console.error("[AdminLogin] Authentication error:", err.message);
      setStatus({
        loading: false,
        error: err.message || "An unexpected error occurred. Please try again."
      });
    }
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-coffee">
            Admin Access
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-text-primary md:text-4xl">
            {mode === "sign-in" ? "Sign in" : "Create admin login"}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Use your owner email and password. Access is granted after your
            account is added to the admin_users table.
          </p>
        </div>

        {!hasSupabaseCredentials && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-700">
              ⚠️ Configuration Error
            </p>
            <p className="mt-1 text-sm text-rose-600">
              Supabase environment variables are not configured. Please contact
              the site administrator.
            </p>
          </div>
        )}

        <form className="glass-card space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-coffee/15 px-4 py-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-coffee/15 px-4 py-3"
            required
          />
          {status.error && (
            <p className="text-sm font-semibold text-rose-500">
              {status.error}
            </p>
          )}
          <button
            type="submit"
            disabled={status.loading || !hasSupabaseCredentials}
            className="w-full rounded-full bg-coffee px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-coffee disabled:cursor-not-allowed disabled:bg-coffee-light"
          >
            {status.loading
              ? "Working..."
              : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="text-sm font-semibold text-coffee"
        >
          {mode === "sign-in"
            ? "Need to create an admin account?"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
