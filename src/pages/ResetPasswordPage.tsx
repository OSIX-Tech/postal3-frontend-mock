import { useParams, Navigate } from "react-router-dom";
import { ResetPasswordForm } from "@/components/auth";
import { use_auth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { token } = useParams<{ token: string }>();
  const { reset_password, reset_password_pending } = use_auth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handle_submit = async (password: string) => {
    await reset_password({ token, password });
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          {t('reset_password.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm
          on_submit={handle_submit}
          is_loading={reset_password_pending}
        />
      </CardContent>
    </Card>
  );
}
