import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profile_service } from "@/services/profile-service";
import type {
  UpdateProfileRequest,
  UpdateSettingsRequest,
} from "@/types/profile";

// ============================================
// MY PROFILE
// ============================================

export function use_my_profile() {
  const query_client = useQueryClient();

  const profile_query = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => profile_service.get_my_profile(),
  });

  const update_profile_mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profile_service.update_profile(data),
    onSuccess: (updated) => {
      query_client.setQueryData(["my-profile"], updated);
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el perfil");
    },
  });

  const update_settings_mutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) =>
      profile_service.update_settings(data),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Ajustes actualizados");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar los ajustes");
    },
  });

  const upload_avatar_mutation = useMutation({
    mutationFn: (file: File) => profile_service.upload_avatar(file),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Avatar actualizado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al subir el avatar");
    },
  });

  const set_active_oposicion_mutation = useMutation({
    mutationFn: (oposicion_id: string) =>
      profile_service.set_active_oposicion(oposicion_id),
    onSuccess: (updated) => {
      query_client.setQueryData(["my-profile"], updated);
      toast.success("Oposición activa actualizada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cambiar la oposición activa");
    },
  });

  const add_oposicion_mutation = useMutation({
    mutationFn: (oposicion_id: string) =>
      profile_service.add_oposicion(oposicion_id),
    onSuccess: (updated) => {
      query_client.setQueryData(["my-profile"], updated);
      toast.success("Oposición añadida");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al añadir la oposición");
    },
  });

  const remove_oposicion_mutation = useMutation({
    mutationFn: (oposicion_id: string) =>
      profile_service.remove_oposicion(oposicion_id),
    onSuccess: (updated) => {
      query_client.setQueryData(["my-profile"], updated);
      toast.success("Oposición eliminada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la oposición");
    },
  });

  const available_oposiciones_query = useQuery({
    queryKey: ["available-oposiciones"],
    queryFn: () => profile_service.get_available_oposiciones(),
    enabled: false,
  });

  return {
    profile: profile_query.data,
    is_loading: profile_query.isLoading,
    is_error: profile_query.isError,
    error: profile_query.error,

    update_profile: update_profile_mutation.mutateAsync,
    update_profile_pending: update_profile_mutation.isPending,

    update_settings: update_settings_mutation.mutateAsync,
    update_settings_pending: update_settings_mutation.isPending,

    upload_avatar: upload_avatar_mutation.mutateAsync,
    upload_avatar_pending: upload_avatar_mutation.isPending,

    set_active_oposicion: set_active_oposicion_mutation.mutateAsync,
    add_oposicion: add_oposicion_mutation.mutateAsync,
    remove_oposicion: remove_oposicion_mutation.mutateAsync,
    oposicion_pending:
      set_active_oposicion_mutation.isPending ||
      add_oposicion_mutation.isPending ||
      remove_oposicion_mutation.isPending,

    available_oposiciones: available_oposiciones_query.data,
    fetch_available_oposiciones: available_oposiciones_query.refetch,
  };
}

// ============================================
// USER PROFILE
// ============================================

export function use_user_profile(user_id: string) {
  const query_client = useQueryClient();

  const profile_query = useQuery({
    queryKey: ["user-profile", user_id],
    queryFn: () => profile_service.get_user_profile(user_id),
    enabled: !!user_id,
  });

  const send_friend_request_mutation = useMutation({
    mutationFn: () => profile_service.send_friend_request(user_id),
    onSuccess: () => {
      query_client.invalidateQueries({
        queryKey: ["user-profile", user_id],
      });
      toast.success("Solicitud de amistad enviada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al enviar la solicitud");
    },
  });

  const accept_friend_request_mutation = useMutation({
    mutationFn: () => profile_service.accept_friend_request(user_id),
    onSuccess: () => {
      query_client.invalidateQueries({
        queryKey: ["user-profile", user_id],
      });
      toast.success("Solicitud de amistad aceptada");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al aceptar la solicitud");
    },
  });

  const block_user_mutation = useMutation({
    mutationFn: () => profile_service.block_user(user_id),
    onSuccess: () => {
      query_client.invalidateQueries({
        queryKey: ["user-profile", user_id],
      });
      query_client.invalidateQueries({ queryKey: ["blocked-users"] });
      toast.success("Usuario bloqueado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al bloquear al usuario");
    },
  });

  return {
    profile: profile_query.data,
    is_loading: profile_query.isLoading,
    is_error: profile_query.isError,

    send_friend_request: send_friend_request_mutation.mutate,
    send_friend_request_pending: send_friend_request_mutation.isPending,

    accept_friend_request: accept_friend_request_mutation.mutate,
    accept_friend_request_pending: accept_friend_request_mutation.isPending,

    block_user: block_user_mutation.mutate,
    block_user_pending: block_user_mutation.isPending,
  };
}

// ============================================
// BLOCKED USERS
// ============================================

export function use_blocked_users() {
  const query_client = useQueryClient();

  const blocked_query = useQuery({
    queryKey: ["blocked-users"],
    queryFn: () => profile_service.get_blocked_users(),
  });

  const unblock_mutation = useMutation({
    mutationFn: (user_id: string) => profile_service.unblock_user(user_id),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["blocked-users"] });
      toast.success("Usuario desbloqueado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desbloquear al usuario");
    },
  });

  return {
    blocked_users: blocked_query.data ?? [],
    is_loading: blocked_query.isLoading,
    unblock_user: unblock_mutation.mutateAsync,
    unblock_pending: unblock_mutation.isPending,
  };
}
