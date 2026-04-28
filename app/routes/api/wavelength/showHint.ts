import { AdminData, setAllHints } from "~/utils/playData.server";
import type { ActionFunctionArgs } from "react-router";
import { broadcast } from "~/routes/events/sse.events";
import type { WavelengthQuestion } from "~/types/adminTypes";

export async function action({}: ActionFunctionArgs) {
  setAllHints(
    (AdminData.currentQuestion as WavelengthQuestion).config.answer ?? "",
    true,
  );

  broadcast("answerType", new Date());
}
