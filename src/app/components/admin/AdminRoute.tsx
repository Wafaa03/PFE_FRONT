import { Navigate } from "react-router";
import { isAuthenticated, getUser } from "../../lib/auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (user?.role !== "admin") {
    // Redirect to home if user is not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
