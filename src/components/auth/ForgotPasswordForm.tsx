import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const forgot_password_schema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgot_password_schema>;

interface ForgotPasswordFormProps {
  on_submit: (email: string) => Promise<void>;
  is_loading?: boolean;
  error?: string | null;
}

export function ForgotPasswordForm({
  on_submit,
  is_loading,
  error,
}: ForgotPasswordFormProps) {
  const [is_sent, set_is_sent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgot_password_schema),
    defaultValues: {
      email: "",
    },
  });

  const handle_submit = async (data: ForgotPasswordFormData) => {
    await on_submit(data.email);
    set_is_sent(true);
  };

  if (is_sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">¡Email enviado!</h2>
          <p className="text-sm text-muted-foreground">
            Hemos enviado un enlace de recuperación a{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Si no recibes el email en unos minutos, revisa tu carpeta de spam.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handle_submit)} className="space-y-5">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Introduce tu email y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

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

      <Button type="submit" className="w-full" size="lg" disabled={is_loading}>
        {is_loading ? (
          <>
            <Spinner size="sm" className="border-white/30 border-t-white" />
            Enviando...
          </>
        ) : (
          "Enviar enlace de recuperación"
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
