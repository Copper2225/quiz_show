import MultipleChoiceBaseShow from "~/routes/show/components/QuestionTypes/MultipleChoiceBaseShow";
import { useEffect, useMemo } from "react";
import BuzzerBaseShow from "~/routes/show/components/QuestionTypes/BuzzerBaseShow";
import type {
  BuzzerQuestion,
  InputQuestion,
  MultipleChoiceQuestion,
  OrderQuestion,
  PinQuestion,
} from "~/types/adminTypes";
import { useEventSource } from "remix-utils/sse/react";
import InputBaseShow from "~/routes/show/components/QuestionTypes/InputBaseShow";
import { useRevalidator } from "react-router";
import OrderBaseShow from "~/routes/show/components/QuestionTypes/OrderBaseShow";
import PinQuestionShow from "~/routes/show/components/QuestionTypes/PinQuestion/PinQuestionShow";
import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";

interface Props {
  question: Question<JsonValue>;
  withHeader: boolean;
  answerRevealed: boolean;
  answers: Map<string, { answer: string; time: Date }>;
  playerReveals: Map<string, boolean>;
}

const BaseQuestionShow = ({
  question,
  withHeader,
  answerRevealed,
  answers,
  playerReveals,
}: Props) => {
  const questionEvent = useEventSource("/sse/events", {
    event: "reveal",
  });
  const revalidator = useRevalidator();

  useEffect(() => {
    revalidator.revalidate();
  }, [questionEvent]);

  const detailed = useMemo(() => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceBaseShow
            data={(question as MultipleChoiceQuestion).config}
            showCorrect={answerRevealed}
          />
        );
      case QuestionType.INPUT:
        return (
          <InputBaseShow
            question={question as InputQuestion}
            withHeader={withHeader}
            showAnswer={answerRevealed}
          />
        );
      case QuestionType.ORDER:
        return (
          <OrderBaseShow
            data={(question as OrderQuestion).config}
            showCorrect={answerRevealed}
          />
        );
      case QuestionType.PIN:
        return (
          <PinQuestionShow
            question={question as PinQuestion}
            answers={answers}
            showAnswer={answerRevealed}
            withHeader={withHeader}
            playerReveals={playerReveals}
          />
        );
      case QuestionType.BUZZER:
      case QuestionType.NONE:
        return (
          <BuzzerBaseShow
            question={question as BuzzerQuestion}
            withHeader={withHeader}
            showAnswer={answerRevealed}
          />
        );
      default:
        return <div></div>;
    }
  }, [question, withHeader, answerRevealed, playerReveals]);

  return (
    <div
      className={
        "bg-gray-800 border-teal-700 border-4 rounded-3xl w-[95%] flex-1 min-h-0 self-center flex flex-col text-5xl"
      }
    >
      {withHeader && (
        <div
          style={{
            borderRadius:
              "calc(var(--radius-3xl) - 4px) calc(var(--radius-3xl) - 4px) 0 0",
          }}
          className={"bg-gray-700 rounded-t-3xl px-4 py-3 text-center"}
        >
          {question.prompt}
        </div>
      )}
      {detailed}
    </div>
  );
};

export default BaseQuestionShow;
