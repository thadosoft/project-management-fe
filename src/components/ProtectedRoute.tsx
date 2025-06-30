// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

