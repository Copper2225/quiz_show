import { getPlayerPoints } from "~/utils/playData.server";

export async function loader() {
  return { teamPoints: getPlayerPoints() };
}
