
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  children
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Se estiver carregando, mostrar nada ou um spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota requer funções específicas e o usuário não tem permissão
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Se autenticado e com permissão, mostrar o conteúdo
  return children ? <>{children}</> : <Outlet />;
};
