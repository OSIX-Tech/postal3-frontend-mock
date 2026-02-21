import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

function create_login_schema(t: TFunction<'auth'>) {
  return z.object({
    email: z.string().email(t('validation.email_invalid')),
    password: z.string().min(6, t('validation.min_6_chars')),
    remember_me: z.boolean().optional(),
  });
}

type LoginFormData = z.infer<ReturnType<typeof create_login_schema>>;

interface LoginFormProps {
  on_submit: (data: LoginFormData) => Promise<void>;
  is_loading?: boolean;
  error?: string | null;
}

export function LoginForm({ on_submit, is_loading, error }: LoginFormProps) {
  const { t } = useTranslation('auth');
  const [show_password, set_show_password] = useState(false);
  const login_schema = useMemo(() => create_login_schema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(login_schema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });

  const remember_me = watch("remember_me");

  return (
    <form onSubmit={handleSubmit(on_submit)} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t('login.email_label')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('login.email_placeholder')}
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('login.password_label')}</Label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            {t('login.forgot_password')}
          </Link>
        </div>
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

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember_me"
          checked={remember_me}
          onCheckedChange={(checked) => setValue("remember_me", !!checked)}
          disabled={is_loading}
        />
        <Label htmlFor="remember_me" className="text-sm font-normal cursor-pointer">
          {t('login.remember_me')}
        </Label>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={is_loading}>
        {is_loading ? (
          <>
            <Spinner size="sm" className="border-white/30 border-t-white" />
            {t('login.submit_loading')}
          </>
        ) : (
          t('login.submit')
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('login.no_account')}{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          {t('login.register_link')}
        </Link>
      </p>
    </form>
  );
}
