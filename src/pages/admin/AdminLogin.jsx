import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

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

    const action =
      mode === "sign-in"
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { error } = await action({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      setStatus({ loading: false, error: error.message });
      return;
    }

    setStatus({ loading: false, error: "" });
    navigate("/admin");
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-primary">
            Admin Access
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-slate md:text-4xl">
            {mode === "sign-in" ? "Sign in" : "Create admin login"}
          </h1>
          <p className="mt-2 text-sm text-neutral-slate/70">
            Use your owner email and password. Access is granted after your
            account is added to the admin_users table.
          </p>
        </div>

        <form className="glass-card space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-accent-sand/40 px-4 py-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-accent-sand/40 px-4 py-3"
            required
          />
          {status.error && (
            <p className="text-sm font-semibold text-rose-500">
              {status.error}
            </p>
          )}
          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-primary disabled:cursor-not-allowed disabled:bg-neutral-slate/30"
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
          className="text-sm font-semibold text-brand-primary"
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
