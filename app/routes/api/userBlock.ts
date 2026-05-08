import type { Route } from "./+types/userReveal";
import dot from "dot-object";
import {
  AdminData,
  removeUserAnswer,
  setUserLocked,
} from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  if (requestValues.block) {
    setUserLocked(requestValues.user, requestValues.block === "true");
    broadcast("lockAnswers", {
      locked: JSON.parse(requestValues.block),
      user: requestValues.user,
    });
  } else if (requestValues.clear) {
    const teamNames = Array.from(AdminData.teams.keys());
    const teamIndex = teamNames.indexOf(requestValues.user ?? "");
    removeUserAnswer(requestValues.user);
    broadcast("lockAnswers", {
      cleared: new Date(),
      user: requestValues.user,
      command: [`input-t${teamIndex + 1};-1`],
    });
  }
}
