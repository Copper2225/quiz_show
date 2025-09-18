import { broadcast } from "~/routes/events/sse.events";
import dot from "dot-object";
import type { Route } from "./+types/reveal";
import { setAnswerRevealed } from "~/utils/playData.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  broadcast("reveal", requestValues);
  setAnswerRevealed(requestValues.revealed === "true");
}
