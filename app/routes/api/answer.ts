import type { Route } from "./+types/answer";
import dot from "dot-object";
import { getUserNameFromRequest } from "~/utils/session.server";
import { sendToAdmin } from "~/routes/Events/sse.events.admin";
import { getUserAnswer, setUserAnswer } from "~/utils/playData.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  sendToAdmin("answer", {
    from: getUserNameFromRequest(request),
    data: {
      ...requestValues,
      time: new Date(),
    },
  });
  setUserAnswer(getUserNameFromRequest(request), requestValues.answer);
  return { answer: requestValues.answer };
}

export async function loader({ request }: Route.LoaderArgs) {
  const answer = getUserAnswer(getUserNameFromRequest(request));
  return { answer };
}
