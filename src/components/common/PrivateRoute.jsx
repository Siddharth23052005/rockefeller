import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";

export default function PrivateRoute({ children, requiredRole }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return (
    <Box sx={{
      minHeight: "100vh", bgcolor: "#131313",
      display: "flex", flexDirection: "column",
      alignItems: "stretch", justifyContent: "center", gap: 2,
      px: 4,
    }}>
      <Skeleton height={44} width="45%" />
      <Skeleton height={100} />
      <Skeleton height={100} />
      <Typography sx={{ color: "#e4beba", fontSize: 12,
        letterSpacing: "0.1em", fontWeight: 300 }}>
        AUTHENTICATING...
      </Typography>
    </Box>
  );

  if (!currentUser) return <Navigate to="/login" replace />;

  // Optional role guard
  if (requiredRole && currentUser.role !== requiredRole)
    return <Navigate to="/dashboard" replace />;

  return children;
}
