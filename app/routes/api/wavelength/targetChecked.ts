import { getUserNameFromRequest } from "~/utils/session.server";
import { AdminData, setUserShowHint } from "~/utils/playData.server";
import type { ActionFunctionArgs } from "react-router";
import { broadcast } from "~/routes/events/sse.events";
import dot from "dot-object";
import type { WavelengthQuestion } from "~/types/adminTypes";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.user) {
    setUserShowHint(
      requestValues.user,
      true,
      (AdminData.currentQuestion as WavelengthQuestion).config.answer ?? "",
    );
    broadcast("answerType", new Date());
  } else {
    const user = await getUserNameFromRequest(request);
    if (user) setUserShowHint(user, false, requestValues.hint);
  }

  broadcast("answer", new Date());
}
