import type { Route } from "./+types/userReveal";
import dot from "dot-object";
import { setUserLocked } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  setUserLocked(requestValues.user, requestValues.block === "true");
  broadcast("lockAnswers", {
    locked: JSON.parse(requestValues.block),
    user: requestValues.user,
  });
}
