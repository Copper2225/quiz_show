import type { Route } from "../../../.react-router/types/app/routes/api/+types/reveal";
import dot from "dot-object";
import { sendToTimer } from "~/routes/events/sse.timer";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  sendToTimer("timeSet", requestValues.time);
}
