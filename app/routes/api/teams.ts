import type { Route } from "./+types/teams";
import { getTeams, setTeamPoints } from "~/utils/playData.server";
import dot from "dot-object";
import { broadcast } from "~/routes/events/sse.events";

export async function loader(_args: Route.LoaderArgs) {
  const teams = getTeams();
  return { teams };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  setTeamPoints(requestValues.name, Number(requestValues.points));
  broadcast("pointsUpdate", requestValues);
}
