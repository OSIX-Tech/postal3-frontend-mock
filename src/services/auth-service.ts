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

export const auth_service = mock_auth_service;
