import type { Route } from "./+types/selector";
import { AdminData } from "~/utils/playData.server";
import dot from "dot-object";
import { sendToAdmin } from "~/routes/events/sse.events.admin";
import { broadcast } from "~/routes/events/sse.events";

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

  const teamId = AdminData.currentSelector + 1;
  const command =
    AdminData.showCurrentSelector && AdminData.currentSelector !== -1
      ? `active-t${teamId};255`
      : "active-off;255";

  sendToAdmin("selector", {
    date: new Date().toString(),
    selector: AdminData.currentSelector,
    command: [command],
  });

  broadcast("selector", {
    date: new Date().toString(),
    selector: AdminData.currentSelector,
    showSelector: AdminData.showCurrentSelector,
  });
}
