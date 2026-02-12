import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const register_schema = z
  .object({
    name: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type RegisterFormData = z.infer<typeof register_schema>;

export interface RegisterSubmitData {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  on_submit: (data: RegisterSubmitData) => Promise<void>;
  is_loading?: boolean;
  error?: string | null;
}

export function RegisterForm({ on_submit, is_loading, error }: RegisterFormProps) {
  const [show_password, set_show_password] = useState(false);
  const [show_confirm, set_show_confirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(register_schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const handle_submit = (data: RegisterFormData) => {
    return on_submit({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(handle_submit)} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            className={cn("pl-10", errors.name && "border-destructive")}
            disabled={is_loading}
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={cn("pl-10", errors.email && "border-destructive")}
            disabled={is_loading}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
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
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
