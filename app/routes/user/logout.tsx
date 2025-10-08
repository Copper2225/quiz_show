import { Form, useLoaderData } from "react-router";
import type { Route } from "./+types/login";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  clearUserCookie,
  getUserNameFromRequest,
} from "~/utils/session.server";
import { AdminData } from "~/utils/playData.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userName = await getUserNameFromRequest(request);
  return { userName };
}

export async function action({ request }: Route.ActionArgs) {
  const name = await getUserNameFromRequest(request);
  if (name) {
    AdminData.teams.delete(name);
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await clearUserCookie(),
    },
  });
}

export default function logout() {
  const { userName } = useLoaderData<typeof loader>();
  return (
    <main>
      <div className={"p-3"}>
        <Form method="POST" className={"flex flex-col gap-3"}>
          <Label htmlFor={"teamName"}>{userName}</Label>
          <Button className={"w-full self-center"} type="submit">
            Logout
          </Button>
        </Form>
      </div>
    </main>
  );
}
