import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  adminOnly = false,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log("Current User:", user);
  console.log("Is Admin Check:", user?.is_staff);

  // 1. If not logged in at all -> Send to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in, but page requires Admin and user is NOT staff -> Send to 403
  if (adminOnly && !user?.is_staff) {
    return <Navigate to="/forbidden" replace />;
  }

  // 3. If all checks pass -> Render the requested page (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
