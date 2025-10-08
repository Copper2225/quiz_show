import type { Route } from "./+types/teams";
import { AdminData, setTeamPoints } from "~/utils/playData.server";
import dot from "dot-object";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.kick === "true") {
    AdminData.teams.delete(requestValues.name);
  } else {
    setTeamPoints(requestValues.name, Number(requestValues.points));
  }
  broadcast("pointsUpdate", requestValues);
}
