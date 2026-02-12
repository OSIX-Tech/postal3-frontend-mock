import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/config/env";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  is_authenticated: boolean;
  set_auth: (user: User, token: string) => void;
  logout: () => void;
}

const DEMO_USER: User = {
  id: "1",
  name: "María García",
  email: "demo@postal3.com",
  avatar: "/opo_study.png",
};

const DEMO_TOKEN = "demo-token-postal3";

// En dev, limpiar storage previo para forzar demo user
if (env.IS_DEV) {
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("auth_token");
}

export const use_auth_store = create<AuthState>()(
  persist(
    (set) => ({
      user: env.IS_DEV ? DEMO_USER : null,
      token: env.IS_DEV ? DEMO_TOKEN : null,
      is_authenticated: env.IS_DEV ? true : false,
      set_auth: (user, token) => {
        localStorage.setItem("auth_token", token);
        set({ user, token, is_authenticated: true });
      },
      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null, is_authenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
