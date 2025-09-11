import { Form } from "react-router";
import type { Route } from "./+types/login";
import { prisma } from "~/utils/db.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createUserCookie } from "~/utils/session.server";

export async function loader({}: Route.LoaderArgs) {
  const questions = await prisma.questionEntity.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return { questions };
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();

  const teamName = (data.get("teamName") as string | null)?.trim() ?? "";
  if (!teamName) {
    return new Response("Invalid name", { status: 400 });
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await createUserCookie(teamName),
    },
  });
}

export default function login() {
  return (
    <main>
      <div className={"p-3"}>
        <Form method="POST" className={"flex flex-col gap-3"}>
          <Label htmlFor={"teamName"}>Teamname</Label>
          <Input name={"teamName"} id={"teamName"} />
          <Button className={"w-full self-center"} type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </main>
  );
}
