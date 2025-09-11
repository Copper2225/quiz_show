import type { Route } from "./+types/question";
import {
  clearQuestion,
  getActiveMatrix,
  getQuestion,
  setAnswerType,
  setQuestion,
  disableActiveMatrix,
} from "~/utils/playData.server";
import dot from "dot-object";
import { broadcast } from "~/routes/events/sse.events";
import type { MultipleChoiceQuestion } from "~/types/userTypes";

export async function loader(_args: Route.LoaderArgs) {
  const question = getQuestion();
  const activeMatrix = getActiveMatrix();
  return { question, activeMatrix };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  console.log(requestValues);

  const quest =
    requestValues.data !== undefined
      ? await setQuestion(
          JSON.parse(requestValues.data).row,
          JSON.parse(requestValues.data).col,
        )
      : clearQuestion();

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
