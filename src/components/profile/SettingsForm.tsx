import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileSettings, UpdateProfileRequest } from "@/types/profile";

// ============================================
// PROFILE INFO FORM
// ============================================

const profile_schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  bio: z.string().max(200, "Máximo 200 caracteres").optional(),
});

type ProfileFormData = z.infer<typeof profile_schema>;

interface ProfileInfoFormProps {
  name: string;
  bio?: string;
  on_submit: (data: UpdateProfileRequest) => Promise<void>;
  is_loading?: boolean;
}

export function ProfileInfoForm({
  name,
  bio,
  on_submit,
  is_loading = false,
}: ProfileInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profile_schema),
    defaultValues: { name, bio: bio ?? "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Información del perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => on_submit(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} disabled={is_loading} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Input
              id="bio"
              {...register("bio")}
              placeholder="Cuéntanos algo sobre ti..."
              disabled={is_loading}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <Button type="submit" disabled={is_loading} size="sm">
            {is_loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// PRIVACY SETTINGS FORM
// ============================================

interface PrivacySettingsFormProps {
  settings: ProfileSettings;
  on_change: (key: keyof ProfileSettings, value: boolean) => void;
  is_loading?: boolean;
}

const SETTING_LABELS: Record<keyof ProfileSettings, string> = {
  show_stats: "Mostrar estadísticas en mi perfil",
  show_badges: "Mostrar insignias en mi perfil",
  show_elo: "Mostrar ELO en mi perfil",
  show_streak: "Mostrar racha en mi perfil",
  allow_friend_requests: "Permitir solicitudes de amistad",
  email_notifications: "Notificaciones por email",
};

export function PrivacySettingsForm({
  settings,
  on_change,
  is_loading = false,
}: PrivacySettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Privacidad y notificaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Object.keys(SETTING_LABELS) as (keyof ProfileSettings)[]).map(
          (key) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="cursor-pointer">
                {SETTING_LABELS[key]}
              </Label>
              <Switch
                id={key}
                checked={settings[key]}
                onCheckedChange={(checked: boolean) => on_change(key, checked)}
                disabled={is_loading}
              />
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
