import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box } from "@mui/material";
import Skeleton from "react-loading-skeleton";

export default function PrivateRoute({ children, requiredRole = null }) {
  const auth = useAuth();

  // Still checking token with /api/auth/me
  if (!auth || auth.isLoading) {
    return (
      <Box sx={{ height: "100vh", bgcolor: "#0a0a0a", p: 4 }}>
        <Skeleton height={56} style={{ marginBottom: 20 }} />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2 }}>
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </Box>
      </Box>
    );
  }

  // Not logged in → go to login
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Role check — if page needs admin but user is field_worker → go to dashboard
  if (requiredRole && auth.currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
