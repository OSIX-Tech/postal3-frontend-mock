import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { GuestGuard } from "@/components/auth";

export function AuthLayout() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-violet-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <header className="flex items-center justify-center p-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center group-hover:bg-violet-700 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Postal3
              </span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400 -mt-1 font-medium tracking-wide">
                ACADEMIA
              </span>
            </div>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Postal3. Todos los derechos reservados.
        </footer>
      </div>
    </GuestGuard>
  );
}
