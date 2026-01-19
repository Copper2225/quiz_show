import { broadcast } from "~/routes/events/sse.events";
import {
  AdminData,
  getUserAnswer,
  setUserAnswer,
} from "~/utils/playData.server";
import { QuestionType } from "~/types/question";
import type { HigherLowerQuestion } from "~/types/adminTypes";
import { sendToAdmin } from "~/routes/events/sse.events.admin";

export async function action() {
  console.log(AdminData.currentQuestion?.type);
  if (AdminData.currentQuestion?.type === QuestionType.HIGHER_LOWER) {
    const question = AdminData.currentQuestion as HigherLowerQuestion;
    const teamKeys = Array.from(AdminData.teams.keys());
    const team = teamKeys[question.config.selector];
    const prevAnswer = getUserAnswer(team)?.answer ?? "";
    setUserAnswer(
      team,
      prevAnswer.substring(-1, prevAnswer.length - 2),
      new Date(),
    );

    let nextSelector = question.config.selector;
    for (let i = 1; i <= AdminData.teams.size; i++) {
      const candidateIndex =
        (question.config.selector + i) % AdminData.teams.size;
      const candidateTeam = teamKeys[candidateIndex];
      const answer = getUserAnswer(candidateTeam)?.answer;
      if (answer && answer.length > 0) {
        nextSelector = candidateIndex;
        break;
      }
    }
    question.config.selector = nextSelector;
    sendToAdmin("answer", new Date());
  }
  broadcast("wrongAnswer", new Date());
}
