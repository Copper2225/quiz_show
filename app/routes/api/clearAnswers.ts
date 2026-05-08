import { clearUserAnswers } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action() {
  clearUserAnswers();
  broadcast("clearAnswers", {
    date: new Date().toString(),
    command: [
      "input-t1",
      "input-t2",
      "input-t3",
      "input-t4",
      "input-t5",
      "input-t6",
    ],
  });
}
