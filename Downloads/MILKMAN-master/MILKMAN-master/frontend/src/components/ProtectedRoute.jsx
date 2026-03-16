import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../services/api";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();

  if (adminOnly) {
    if (!isAdmin()) return <Navigate to="/admin-login" state={{ from: location }} replace />;
    return children;
  }

  if (!isLoggedIn()) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}