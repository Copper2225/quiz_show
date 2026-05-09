import type { ActionFunctionArgs } from "react-router";
import dot from "dot-object";
import { AdminData, getUserAnswer } from "~/utils/playData.server";
import { broadcast } from "~/routes/events/sse.events";
import type { HigherLowerQuestion } from "~/types/adminTypes";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  const question = AdminData.currentQuestion as HigherLowerQuestion;

  if (question && question.config && Array.isArray(question.config.options)) {
    const option = question.config.options.find(
      (item) => item.value === requestValues.value,
    );
    if (option) {
      option.show = !option.show;

      if (Array.isArray(question.config.shuffledOptions)) {
        const shuffledOption = question.config.shuffledOptions.find(
          (item) => item.value === requestValues.value,
        );
        if (shuffledOption) {
          shuffledOption.show = option.show;
        }
      }

      const teamKeys = Array.from(AdminData.teams.keys());
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
      const command = [`active-t${nextSelector + 1};255`];

      broadcast("reveal", { question, command });
      return { success: true };
    }
  }

  return { success: false };
}
