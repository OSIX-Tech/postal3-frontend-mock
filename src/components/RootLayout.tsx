import { Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { use_auth } from "@/hooks/use-auth";
import { CoachOverlay } from "@/components/coach";

export function RootLayout() {
  const { user, logout } = use_auth();

  return (
    <AppLayout
      user={user}
      notifications_count={3}
      streak_days={12}
      cart_items={0}
      on_logout={logout}
    >
      <Outlet />
      <CoachOverlay />
    </AppLayout>
  );
}
