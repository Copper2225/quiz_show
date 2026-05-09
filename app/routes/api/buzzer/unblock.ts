import { broadcast } from "~/routes/events/sse.events";
import {
  AdminData,
  clearUserAnswers,
  setAllLocked,
} from "~/utils/playData.server";

export async function action() {
  clearUserAnswers();
  setAllLocked(false);
  AdminData.disqualifiedTeams.clear();
  AdminData.currentSelector = -1;
  AdminData.showCurrentSelector = false;

  broadcast("selector", {
    date: new Date().toString(),
    selector: AdminData.currentSelector,
    showSelector: AdminData.showCurrentSelector,
  });

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
  broadcast("lockAnswers", {
    locked: false,
    all: true,
    time: new Date(),
  });
  return { ok: true };
}
