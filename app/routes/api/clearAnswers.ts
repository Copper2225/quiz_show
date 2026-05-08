import { clearUserAnswers } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";

export async function action() {
  clearUserAnswers();
  broadcast("clearAnswers", {
    date: new Date().toString(),
    command: [
      "input-t1;-1",
      "input-t2;-1",
      "input-t3;-1",
      "input-t4;-1",
      "input-t5;-1",
      "input-t6;-1",
    ],
  });
}
