import type { Route } from ".react-router/types/app/routes/Api/+types/buzzer";
import { sendToAdmin } from "~/routes/Events/sse.events.admin";
import { getUserNameFromRequest } from "~/utils/session.server";

export async function action({ request }: Route.ActionArgs) {
  sendToAdmin("buzzer", { from: await getUserNameFromRequest(request) });
}
