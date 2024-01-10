import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./pages/loading/Loading";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  if (!loading && !isAuthenticated) return <Navigate to="/" replace />; //replace es para que no vuelva a la ruta anterior

  return <Outlet />;
}
