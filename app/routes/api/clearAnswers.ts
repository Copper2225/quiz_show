import { clearUserAnswers } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action() {
  clearUserAnswers();
  broadcast("clearAnswers", new Date());
}
