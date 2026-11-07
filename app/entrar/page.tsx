import type { Metadata } from "next";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAs } from "@/features/auth/actions";
import { listUsers } from "@/features/auth/session";

export const metadata: Metadata = { title: "Entrar" };

export default async function SignInPage() {
  const users = await listUsers();

  return (
    <Card className="mx-auto mt-8 w-full max-w-sm">
      <CardHeader>
        <Eyebrow>Reserva de salas</Eyebrow>
        <CardTitle className="text-2xl font-medium tracking-tight">
          Entrar
        </CardTitle>
        <CardDescription>Escolha um usuário para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <li key={user.id}>
              <form action={loginAs}>
                <input type="hidden" name="userId" value={user.id} />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-auto w-full justify-between py-2"
                >
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role === "ADMIN" ? "Admin" : "Comum"}
                  </span>
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
