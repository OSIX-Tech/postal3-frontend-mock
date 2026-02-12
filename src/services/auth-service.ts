import { api_client } from "@/lib/api-client";
import { env } from "@/config/env";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mock_auth_service = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await delay(500);
    return {
      user: {
        id: "1",
        email: data.email,
        name: data.email.split("@")[0],
      },
      token: "mock_token_" + Date.now(),
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(500);
    return {
      user: {
        id: "1",
        email: data.email,
        name: data.name,
      },
      token: "mock_token_" + Date.now(),
    };
  },

  async logout(): Promise<void> {
    await delay(200);
  },

  async forgot_password(_email: string): Promise<void> {
    await delay(500);
  },

  async reset_password(_data: ResetPasswordRequest): Promise<void> {
    await delay(500);
  },

  async get_current_user(): Promise<User> {
    await delay(200);
    return {
      id: "1",
      email: "demo@postal3.com",
      name: "Usuario Demo",
    };
  },

  async refresh_token(): Promise<AuthResponse> {
    await delay(200);
    return {
      user: {
        id: "1",
        email: "demo@postal3.com",
        name: "Usuario Demo",
      },
      token: "mock_token_" + Date.now(),
    };
  },
};

const real_auth_service = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api_client.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api_client.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api_client.post("/auth/logout");
  },

  async forgot_password(email: string): Promise<void> {
    await api_client.post("/auth/forgot-password", { email });
  },

  async reset_password(data: ResetPasswordRequest): Promise<void> {
    await api_client.post("/auth/reset-password", data);
  },

  async get_current_user(): Promise<User> {
    const response = await api_client.get<User>("/auth/me");
    return response.data;
  },

  async refresh_token(): Promise<AuthResponse> {
    const response = await api_client.post<AuthResponse>("/auth/refresh");
    return response.data;
  },
};

export const auth_service = env.IS_DEV ? mock_auth_service : real_auth_service;
