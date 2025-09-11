import type { Route } from "./+types/answer";
import dot from "dot-object";
import { getUserNameFromRequest } from "~/utils/session.server";
import { sendToAdmin } from "~/routes/events/sse.events.admin";
import { getUserAnswer, setUserAnswer } from "~/utils/playData.server";

export async function action({ request }: Route.ActionArgs) {
  const time = new Date();
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  const user = await getUserNameFromRequest(request);
  if (getUserAnswer(user)?.answer !== requestValues.answer)
    sendToAdmin("answer", {
      from: user,
      data: {
        ...requestValues,
        time,
      },
    });
  setUserAnswer(user, requestValues.answer, time);
  return { answer: requestValues.answer };
}

export async function loader({ request }: Route.LoaderArgs) {
  return getUserAnswer(await getUserNameFromRequest(request));
}
