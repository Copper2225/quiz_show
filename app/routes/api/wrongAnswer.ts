import { broadcast } from "~/routes/events/sse.events";
import {
  AdminData,
  getUserAnswer,
  removeUserAnswer,
  setUserAnswer,
  setUserLocked,
} from "~/utils/playData.server";
import { QuestionType } from "~/types/question";
import type { HigherLowerQuestion } from "~/types/adminTypes";
import { sendToAdmin } from "~/routes/events/sse.events.admin";

export async function action() {
  const command = [];
  if (AdminData.currentQuestion?.type === QuestionType.BUZZER) {
    const teamNames = Array.from(AdminData.teams.keys());
    const user = teamNames[AdminData.currentSelector];
    if (user) {
      removeUserAnswer(user);
      setUserLocked(user, true);
      AdminData.disqualifiedTeams.add(user);

      // Reset buzzer state for others
      teamNames.forEach((team) => {
        if (team !== user) {
          const answer = AdminData.answers.get(team);
          const isDisqualified = AdminData.disqualifiedTeams.has(team);
          if (
            (!answer || answer.answer === undefined || answer.answer === "") &&
            !isDisqualified
          ) {
            setUserLocked(team, false);
            broadcast("lockAnswers", {
              locked: false,
              all: false,
              user: team,
              time: new Date(),
            });
          }
        } else {
          // Explicitly lock the wrong team
          broadcast("lockAnswers", {
            locked: true,
            all: false,
            user: team,
            time: new Date(),
          });
        }
      });

      AdminData.currentSelector = -1;
      AdminData.showCurrentSelector = false;

      broadcast("selector", {
        date: new Date().toString(),
        selector: AdminData.currentSelector,
        showSelector: AdminData.showCurrentSelector,
      });

      broadcast("lockAnswers", {
        cleared: new Date(),
        user: user,
        command: [`input-t${teamNames.indexOf(user) + 1};-1`],
      });
    }
  }

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
    const teamId = question.config.selector + 1;
    command.push(`wrong-t${teamId};255`);
    command.push(`active-t${nextSelector + 1 };255`);
    question.config.selector = nextSelector;
    sendToAdmin("answer", {
      date: new Date(),
    });
  }
  
  broadcast("wrongAnswer", {
    date: new Date(),
    command,
  });
}
