import type { Route } from "./+types/answer";
import dot from "dot-object";
import { getUserNameFromRequest } from "~/utils/session.server";
import { sendToAdmin } from "~/routes/events/sse.events.admin";
import {
  AdminData,
  getUserAnswer,
  removeUserAnswer,
  setAllLocked,
  setUserAnswer,
  setUserLocked,
} from "~/utils/playData.server";
import { QuestionType } from "~/types/question";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const time = new Date();
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  const user = await getUserNameFromRequest(request);

  const teamNames = Array.from(AdminData.teams.keys());
  const teamIndex = teamNames.indexOf(user ?? "");
  const commands: string[] = [];
  if (teamIndex !== -1 && AdminData.answers.get(user ?? "") === undefined) {
    const teamId = teamIndex + 1;
    commands.push(`input-t${teamId};255`);
  }

  if (AdminData.currentQuestion?.type === QuestionType.BUZZER && user) {
    const existingBuzz = Array.from(AdminData.answers.entries()).find(
      ([, value]) => value.answer === "buzzer",
    );

    if (existingBuzz && existingBuzz[0] !== user) {
      removeUserAnswer(user);
      setUserLocked(user, true);
      broadcast("lockAnswers", {
        locked: true,
        all: false,
        user: user,
        time,
      });
      return { answer: undefined, blocked: true };
    }

    setAllLocked(true);
    const teamNames = Array.from(AdminData.teams.keys());
    const teamIndex = teamNames.indexOf(user ?? "");
    AdminData.currentSelector = teamIndex;
    AdminData.showCurrentSelector = true;

    broadcast("selector", {
      date: new Date().toString(),
      selector: AdminData.currentSelector,
      showSelector: AdminData.showCurrentSelector,
    });

    broadcast("lockAnswers", {
      locked: true,
      all: true,
      time,
    });
  }

  const existingAnswer = getUserAnswer(user);
  if (existingAnswer?.answer !== requestValues.answer)
    sendToAdmin("answer", {
      from: user,
      data: {
        ...requestValues,
        time,
      },
      command: commands,
    });
  if (AdminData.currentQuestion?.type === QuestionType.BUZZER && user)
    setUserLocked(user, true);
  setUserAnswer(user, requestValues.answer, time);
  return { answer: requestValues.answer };
}

export async function loader({ request }: Route.LoaderArgs) {
  return getUserAnswer(await getUserNameFromRequest(request));
}
