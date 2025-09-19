import type { Route } from "./+types/answers";
import { getAnswers } from "~/utils/playData.server";

export async function loader(_args: Route.LoaderArgs) {
  const answers = getAnswers();
  return { answers };
}
