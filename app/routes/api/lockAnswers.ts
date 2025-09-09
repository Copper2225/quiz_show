import type { Route } from "./+types/lockAnswers";
import dot from "dot-object";
import { getUserNameFromRequest } from "~/utils/session.server";
import { setAllLocked, setUserLocked } from "~/utils/playData.server";
import { broadcast } from "~/routes/Events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.setAll) {
    setAllLocked(JSON.parse(requestValues.locked));
    broadcast("lockAnswers", {
      locked: JSON.parse(requestValues.locked),
      all: true,
    });
  } else {
    const user = await getUserNameFromRequest(request);
    if (user) {
      setUserLocked(user, JSON.parse(requestValues.locked));
      broadcast("lockAnswers", {
        locked: JSON.parse(requestValues.locked),
        user: user,
      });
    }
  }
}
