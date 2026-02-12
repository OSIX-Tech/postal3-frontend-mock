import { RegisterForm } from "@/components/auth";
import type { RegisterSubmitData } from "@/components/auth";
import { use_auth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterPage() {
  const { register: register_user, register_pending, register_error } = use_auth();

  const handle_submit = async (data: RegisterSubmitData) => {
    await register_user(data);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          Crear cuenta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm
          on_submit={handle_submit}
          is_loading={register_pending}
          error={register_error?.message}
        />
      </CardContent>
    </Card>
  );
}
