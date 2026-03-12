import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate replace to={`/dashboard/${user.role}`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
