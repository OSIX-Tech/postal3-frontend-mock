import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { use_auth_store } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";

interface AuthGuardProps {
  children: ReactNode;
  redirect_to?: string;
}

export function AuthGuard({
  children,
  redirect_to = "/login",
}: AuthGuardProps) {
  const { is_authenticated } = use_auth_store();
  const location = useLocation();

  if (!is_authenticated) {
    return (
      <Navigate to={redirect_to} state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
}

interface GuestGuardProps {
  children: ReactNode;
  redirect_to?: string;
}

export function GuestGuard({
  children,
  redirect_to = "/",
}: GuestGuardProps) {
  const { is_authenticated } = use_auth_store();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || redirect_to;

  if (is_authenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
