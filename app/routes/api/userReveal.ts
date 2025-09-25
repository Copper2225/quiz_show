import type { Route } from "./+types/userReveal";
import dot from "dot-object";
import { setAllPlayerReveal, setUserRevealed } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.all === "true") {
    setAllPlayerReveal(requestValues.reveal === "true");
  } else {
    setUserRevealed(requestValues.user, requestValues.reveal === "true");
  }
  broadcast("revealUser", requestValues.reveal);

  console.log(requestValues);
}
