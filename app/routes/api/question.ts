import type { Route } from "./+types/question";
import {
  clearQuestion,
  setQuestion,
  disableActiveMatrix,
  clearUserAnswers,
  setAnswerType,
  resetActiveMatrix,
  AdminData,
} from "~/utils/playData.server";
import dot from "dot-object";
import type { MultipleChoiceQuestion } from "~/types/adminTypes";
import { prisma } from "~/utils/db.server";
import { broadcast } from "../events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.mode === "open") {
    const quest =
      requestValues.data !== undefined
        ? await setQuestion(
            JSON.parse(requestValues.data).row,
            JSON.parse(requestValues.data).col,
          )
        : clearQuestion();

    clearUserAnswers();
    if (quest) {
      disableActiveMatrix(
        JSON.parse(requestValues.data).col,
        JSON.parse(requestValues.data).row,
      );
    }

    const data = quest ? answerData(quest) : { type: "none" };
    setAnswerType(data);
    broadcast("answerType", { data });

    return { quest };
  } else {
    if (requestValues.reset === "true") {
      resetActiveMatrix();
      broadcast("disableEvent", AdminData.activeMatrix);
      return;
    }

    const quest = await prisma.questionEntity.findFirst({
      where: {
        categoryColumn: JSON.parse(requestValues.data).row,
        row: JSON.parse(requestValues.data).col,
      },
    });

    if (quest) {
      disableActiveMatrix(
        JSON.parse(requestValues.data).col,
        JSON.parse(requestValues.data).row,
        true,
      );
      broadcast("disableEvent", AdminData.activeMatrix);
    }
    return { quest };
  }
}

function answerData(question: any) {
  switch (question.type) {
    case "multipleChoice":
      const mcQuestion = question as MultipleChoiceQuestion;
      return {
        options: mcQuestion.config.options.map((option) => option.name),
        showLetters: mcQuestion.config.showLetters,
        trueOrFalse: mcQuestion.config.trueOrFalse,
        type: "multipleChoice",
      };
    default:
      return {
        type: question.type,
      };
  }
}
