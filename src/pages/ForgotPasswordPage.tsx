import { ForgotPasswordForm } from "@/components/auth";
import { use_auth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const { forgot_password, forgot_password_pending } = use_auth();

  const handle_submit = async (email: string) => {
    await forgot_password(email);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          {t('forgot_password.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm
          on_submit={handle_submit}
          is_loading={forgot_password_pending}
        />
      </CardContent>
    </Card>
  );
}
