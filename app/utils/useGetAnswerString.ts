import { type Question, QuestionType } from "~/types/question";
import type {
  BuzzerQuestion,
  InputQuestion,
  MultipleChoiceQuestion,
  OrderQuestion,
  PinData,
  PinQuestion,
} from "~/types/adminTypes";
import type { JsonValue } from "@prisma/client/runtime/client";

export function useGetAnswerString(
  valueAnswer: { answer: string; time: Date } | undefined,
  question: Question<JsonValue> | null,
  questionRevealTime: Date | null,
) {
  if (!valueAnswer) return undefined;
  if (question?.type === QuestionType.BUZZER && questionRevealTime !== null) {
    return (
      (
        Math.abs(questionRevealTime.getTime() - valueAnswer.time.getTime()) /
        1000
      ).toString() + "s"
    );
  } else if (question?.type === QuestionType.PIN) {
    const answerPin = JSON.parse(valueAnswer.answer) as PinData;
    const correctPin = (question as PinQuestion).config.pin;

    if (!correctPin.imgW || !correctPin.imgH) {
      return undefined;
    }

    const x1 = (correctPin.xPercent / 100) * correctPin.imgW;
    const y1 = (correctPin.yPercent / 100) * correctPin.imgH;
    const x2 = (answerPin.xPercent / 100) * correctPin.imgW;
    const y2 = (answerPin.yPercent / 100) * correctPin.imgH;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return (Math.round(dist * 100) / 100).toString() + "px";
  } else if (question?.type === QuestionType.MULTIPLE_CHOICE) {
    const multiQuestion = question as MultipleChoiceQuestion;

    if (multiQuestion.config.showLetters) {
      const userAnswers: string[] = JSON.parse(valueAnswer.answer);

      return userAnswers
        .map((ans) => {
          const index = multiQuestion.config.options.findIndex(
            (opt) => opt.name === ans,
          );
          if (index === -1) return "?";
          return String.fromCharCode("A".charCodeAt(0) + index);
        })
        .join(", ");
    }

    return JSON.parse(valueAnswer.answer).join(", ");
  }
  return valueAnswer?.answer;
}

export function useGetSolutionString(question: Question<JsonValue> | null) {
  if (question === null) {
    return null;
  }
  switch (question.type) {
    case QuestionType.BUZZER:
      return (question as BuzzerQuestion).config.answer;
    case QuestionType.INPUT:
      return (question as InputQuestion).config.answer;
    case QuestionType.PIN:
      return JSON.stringify((question as PinQuestion).config.pin);
    case QuestionType.ORDER:
      return (question as OrderQuestion).config.options
        .map(
          (answer) =>
            (question as OrderQuestion).config.shuffledOptions.indexOf(answer) +
            1,
        )
        .toString();
    case QuestionType.MULTIPLE_CHOICE:
      const multiQuestion = question as MultipleChoiceQuestion;

      if (multiQuestion.config.showLetters) {
        return multiQuestion.config.options
          .map((opt, idx) =>
            opt.checked ? String.fromCharCode("A".charCodeAt(0) + idx) : null,
          )
          .filter(Boolean) // remove nulls
          .join(", ");
      }

      return multiQuestion.config.options
        .filter((opt) => opt.checked)
        .map((opt) => opt.name)
        .join(", ");

    default:
      return null;
  }
}
