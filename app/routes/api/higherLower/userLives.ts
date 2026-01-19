import type { ActionFunctionArgs } from "react-router";
import dot from "dot-object";
import { setUserAnswer } from "~/utils/playData.server";
import { sendToAdmin } from "~/routes/events/sse.events.admin";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  setUserAnswer(requestValues.team, requestValues.answer, new Date());
  sendToAdmin("answer", new Date());
}
