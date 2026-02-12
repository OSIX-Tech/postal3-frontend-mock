import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { use_auth_store } from "@/stores/auth-store";
import { auth_service } from "@/services/auth-service";
import type { LoginRequest, RegisterRequest } from "@/services/auth-service";

export function use_auth() {
  const navigate = useNavigate();
  const query_client = useQueryClient();
  const { user, token, is_authenticated, set_auth, logout: store_logout } = use_auth_store();

  const login_mutation = useMutation({
    mutationFn: (data: LoginRequest) => auth_service.login(data),
    onSuccess: (response) => {
      set_auth(response.user, response.token);
      query_client.clear();
      toast.success("Sesión iniciada correctamente");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al iniciar sesión");
    },
  });

  const register_mutation = useMutation({
    mutationFn: (data: RegisterRequest) => auth_service.register(data),
    onSuccess: (response) => {
      set_auth(response.user, response.token);
      query_client.clear();
      toast.success("Cuenta creada correctamente");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la cuenta");
    },
  });

  const logout_mutation = useMutation({
    mutationFn: async () => {
      try {
        await auth_service.logout();
      } catch {
        // Ignore server errors on logout
      }
    },
    onSuccess: () => {
      store_logout();
      query_client.clear();
      toast.success("Sesión cerrada");
      navigate("/");
    },
  });

  const forgot_password_mutation = useMutation({
    mutationFn: (email: string) => auth_service.forgot_password(email),
    onSuccess: () => {
      toast.success("Te hemos enviado un email con instrucciones");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al enviar el email");
    },
  });

  const reset_password_mutation = useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      auth_service.reset_password(data),
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al restablecer la contraseña");
    },
  });

  return {
    user,
    token,
    is_authenticated,
    is_loading:
      login_mutation.isPending ||
      register_mutation.isPending ||
      logout_mutation.isPending,
    login: login_mutation.mutateAsync,
    login_error: login_mutation.error,
    login_pending: login_mutation.isPending,
    register: register_mutation.mutateAsync,
    register_error: register_mutation.error,
    register_pending: register_mutation.isPending,
    logout: logout_mutation.mutate,
    logout_pending: logout_mutation.isPending,
    forgot_password: forgot_password_mutation.mutateAsync,
    forgot_password_pending: forgot_password_mutation.isPending,
    reset_password: reset_password_mutation.mutateAsync,
    reset_password_pending: reset_password_mutation.isPending,
  };
}
