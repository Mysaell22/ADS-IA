import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    // Return null to avoid rendering anything while checking
    return null;
  }

  if (!user) {
    // Redirect to login, storing the intended location
    navigate("/login", {
      replace: true,
      state: { from: location },
    });
    return null;
  }

  return children;
};
