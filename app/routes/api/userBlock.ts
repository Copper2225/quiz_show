import type { Route } from "./+types/userReveal";
import dot from "dot-object";
import { removeUserAnswer, setUserLocked } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  console.log(requestValues);
  if (requestValues.block) {
    setUserLocked(requestValues.user, requestValues.block === "true");
    broadcast("lockAnswers", {
      locked: JSON.parse(requestValues.block),
      user: requestValues.user,
    });
  } else if (requestValues.clear) {
    removeUserAnswer(requestValues.user);
    broadcast("lockAnswers", {
      cleared: new Date(),
      user: requestValues.user,
    });
  }
}
