import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const ProtectedRoute = ({ allow, children }) => {
  const { user, token } = useApp();

  if (token && !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
