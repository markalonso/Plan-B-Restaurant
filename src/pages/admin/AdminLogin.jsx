import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("sign-in"); // "sign-in" | "sign-up"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({ loading: true, error: "", message: "" });

    try {
      let result;

      if (mode === "sign-in") {
        // ✅ Call method directly (do NOT store it in a variable)
        result = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
      } else {
        // ✅ Sign up
        result = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.error) {
        setStatus({ loading: false, error: result.error.message, message: "" });
        return;
      }

      // ✅ If email confirmation is ON, session may be null after sign up
      if (mode === "sign-up" && !result.data?.session) {
        setStatus({
          loading: false,
          error: "",
          message: "Account created. Check your email to confirm, then sign in."
        });
        return;
      }

      setStatus({ loading: false, error: "", message: "" });
      navigate("/admin");
    } catch (err) {
      setStatus({
        loading: false,
        error: err?.message || "Authentication failed.",
        message: ""
      });
    }
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
            Admin Access
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
            {mode === "sign-in" ? "Sign in" : "Create admin login"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Use your owner email and password. Access is granted after your account is added
            to the admin_users table.
          </p>
        </div>

        <form className="glass-card space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          />

          {status.error && (
            <p className="text-sm font-semibold text-rose-500">{status.error}</p>
          )}

          {status.message && (
            <p className="text-sm font-semibold text-emerald-600">{status.message}</p>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-full bg-skywash-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-skywash-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
          onClick={() => setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"))}
          className="text-sm font-semibold text-skywash-600"
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
