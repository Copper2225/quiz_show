import type { ActionFunctionArgs } from "react-router";
import dot from "dot-object";
import { AdminData } from "~/utils/playData.server";
import type { HigherLowerQuestion } from "~/types/adminTypes";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  (AdminData.currentQuestion as HigherLowerQuestion).config.selector = Number(
    requestValues.selector,
  );
  broadcast("reveal", new Date());
}
