import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const reset_password_schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type ResetPasswordFormData = z.infer<typeof reset_password_schema>;

interface ResetPasswordFormProps {
  on_submit: (password: string) => Promise<void>;
  is_loading?: boolean;
  error?: string | null;
}

export function ResetPasswordForm({
  on_submit,
  is_loading,
  error,
}: ResetPasswordFormProps) {
  const [show_password, set_show_password] = useState(false);
  const [show_confirm, set_show_confirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(reset_password_schema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const handle_submit = (data: ResetPasswordFormData) => {
    return on_submit(data.password);
  };

  return (
    <form onSubmit={handleSubmit(handle_submit)} className="space-y-5">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Introduce tu nueva contraseña. Debe tener al menos 8 caracteres.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={show_password ? "text" : "password"}
            placeholder="••••••••"
            className={cn("pl-10 pr-10", errors.password && "border-destructive")}
            disabled={is_loading}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => set_show_password(!show_password)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {show_password ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirm_password"
            type={show_confirm ? "text" : "password"}
            placeholder="••••••••"
            className={cn(
              "pl-10 pr-10",
              errors.confirm_password && "border-destructive"
            )}
            disabled={is_loading}
            {...register("confirm_password")}
          />
          <button
            type="button"
            onClick={() => set_show_confirm(!show_confirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {show_confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="text-xs text-destructive">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={is_loading}>
        {is_loading ? (
          <>
            <Spinner size="sm" className="border-white/30 border-t-white" />
            Guardando...
          </>
        ) : (
          "Restablecer contraseña"
        )}
      </Button>

      <Button asChild variant="ghost" className="w-full">
        <Link to="/login">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </Button>
    </form>
  );
}
