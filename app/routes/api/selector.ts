import type { Route } from "./+types/selector";
import { AdminData } from "~/utils/playData.server";
import dot from "dot-object";
import { sendToAdmin } from "~/routes/events/sse.events.admin";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  switch (requestValues.intent) {
    case "check":
      AdminData.showCurrentSelector = !AdminData.showCurrentSelector;
      break;
    case "select":
      AdminData.currentSelector = Number(requestValues.team);
      break;
  }
  sendToAdmin("selector", new Date().toString());
}
