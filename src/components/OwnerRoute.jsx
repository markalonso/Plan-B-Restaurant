import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const OwnerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkOwnerAccess();
  }, []);

  const checkOwnerAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is an owner
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error checking owner access:", error);
        setLoading(false);
        return;
      }

      if (adminUser && adminUser.role === "owner") {
        setIsOwner(true);
      }
    } catch (error) {
      console.error("Error in owner route:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-primary">
        <p className="text-text-secondary">Checking access…</p>
      </div>
    );
  }

  if (!isOwner) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default OwnerRoute;
