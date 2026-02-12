import { LoginForm } from "@/components/auth";
import { use_auth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginPage() {
  const { login, login_pending, login_error } = use_auth();

  const handle_submit = async (data: {
    email: string;
    password: string;
    remember_me?: boolean;
  }) => {
    await login(data);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          Bienvenido de nuevo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm
          on_submit={handle_submit}
          is_loading={login_pending}
          error={login_error?.message}
        />
      </CardContent>
    </Card>
  );
}
