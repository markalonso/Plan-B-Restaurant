import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, hasSupabaseCredentials } from "../lib/supabaseClient.js";

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState({
    loading: true,
    authenticated: false,
    authorized: false
  });

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      // If credentials are missing, immediately redirect to login
      if (!hasSupabaseCredentials) {
        if (isMounted) {
          setStatus({ loading: false, authenticated: false, authorized: false });
        }
        return;
      }

      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setStatus({ loading: false, authenticated: false, authorized: false });
          }
          return;
        }

        const { data: adminRow } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (isMounted) {
          setStatus({
            loading: false,
            authenticated: true,
            authorized: Boolean(adminRow)
          });
        }

        if (!adminRow) {
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.error("[AdminRoute] Error checking access:", err);
        if (isMounted) {
          setStatus({ loading: false, authenticated: false, authorized: false });
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status.loading) {
    return (
      <div className="section-padding">
        <p className="text-sm font-semibold text-slate-500">Checking access…</p>
      </div>
    );
  }

  if (!status.authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!status.authorized) {
    return (
      <div className="section-padding">
        <div className="glass-card">
          <h1 className="text-2xl font-semibold text-slate-900">
            Not authorized
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your account does not have admin access.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
