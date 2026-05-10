import MultipleChoiceBaseShow from "~/routes/show/components/QuestionTypes/MultipleChoiceBaseShow";
import { useEffect, useMemo, useState } from "react";
import BuzzerBaseShow from "~/routes/show/components/QuestionTypes/BuzzerBaseShow";
import type {
  BuzzerQuestion,
  HigherLowerQuestion,
  InputQuestion,
  MultipleChoiceQuestion,
  OrderQuestion,
  PinQuestion,
  WavelengthQuestion,
} from "~/types/adminTypes";
import { useEventSource } from "remix-utils/sse/react";
import InputBaseShow from "~/routes/show/components/QuestionTypes/InputBaseShow";
import { useRevalidator } from "react-router";
import OrderBaseShow from "~/routes/show/components/QuestionTypes/OrderBaseShow";
import PinQuestionShow from "~/routes/show/components/QuestionTypes/PinQuestion/PinQuestionShow";
import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import { HigherLowerBaseShow } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/HigherLowerBaseShow";
import WavelengthShow from "~/routes/show/components/QuestionTypes/WavelengthQuestion/WavelengthShow";

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
  const [showWrong, setShowWrong] = useState(false);
  const questionEvent = useEventSource("/sse/events", {
    event: "reveal",
  });
  const wrongEvent = useEventSource("/sse/events", { event: "wrongAnswer" });

  const revalidator = useRevalidator();

  useEffect(() => {
    if (questionEvent) {
      revalidator.revalidate();
    }
  }, [questionEvent]);

  useEffect(() => {
    if (wrongEvent) {
      setShowWrong(true);

      // Remove it after 1.5 seconds
      const timer = setTimeout(() => setShowWrong(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wrongEvent]);

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
            playerReveals={playerReveals}
          />
        );
      case QuestionType.HIGHER_LOWER:
        return (
          <HigherLowerBaseShow question={question as HigherLowerQuestion} showAnswer={answerRevealed} />
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
            answers={answers}
          />
        );
      case QuestionType.WAVELENGTH:
        return (
          <WavelengthShow
            withHeader={withHeader}
            question={question as WavelengthQuestion}
            show={answerRevealed}
          />
        );
      default:
        return <div></div>;
    }
  }, [question, withHeader, answerRevealed, playerReveals, answers]);

  return (
    <div
      className={
        "bg-gray-800 border-primary border-4 rounded-3xl w-full flex-1 min-h-0 self-center flex flex-col text-5xl relative overflow-hidden"
      }
    >
      <div
        className={`
          pointer-events-none absolute inset-0 z-50
          shadow-[inset_0_0_150px_60px_rgba(239,68,68,1)]
          /* Logic: Fast fade-in, slow fade-out */
          transition-all transform
          ${
            showWrong
              ? "opacity-100 scale-100 duration-150 ease-out"
              : "opacity-0 scale-110 duration-1000 ease-in"
          }
        `}
      />
      {withHeader && (
        <div
          style={{
            borderRadius:
              "calc(var(--radius-3xl) - 4px) calc(var(--radius-3xl) - 4px) 0 0",
          }}
          className={
            "bg-gray-700 text-6xl rounded-t-3xl px-4 py-3 text-center whitespace-pre-wrap"
          }
        >
          {question.prompt}
        </div>
      )}
      {detailed}
    </div>
  );
};

export default BaseQuestionShow;
