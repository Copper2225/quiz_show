import type { Route } from "./+types/team-names";
import { getTeams } from "~/utils/playData.server";

export async function loader(_args: Route.LoaderArgs) {
  const teams = getTeams();
  return { teams };
}
