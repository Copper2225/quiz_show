import type { QuestionEntity } from "@prisma/client";
import MultipleChoiceBaseShow from "~/routes/show/components/QuestionTypes/MultipleChoiceBaseShow";
import { useEffect, useMemo, useState } from "react";
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

interface Props {
  question: QuestionEntity;
  withHeader: boolean;
  answerRevealed: boolean;
  answers: Map<string, { answer: string; time: Date }>;
}

const BaseQuestionShow = ({
  question,
  withHeader,
  answerRevealed,
  answers,
}: Props) => {
  const [showCorrect, setShowCorrect] = useState(answerRevealed);
  const questionEvent = useEventSource("/sse/events", {
    event: "reveal",
  });
  const revalidator = useRevalidator();

  useEffect(() => {
    if (questionEvent) {
      try {
        setShowCorrect(JSON.parse(questionEvent).revealed === "true");
        revalidator.revalidate();
      } catch {}
    }
  }, [questionEvent]);

  const detailed = useMemo(() => {
    switch (question.type) {
      case "multipleChoice":
        return (
          <MultipleChoiceBaseShow
            data={(question as MultipleChoiceQuestion).config}
            showCorrect={showCorrect}
          />
        );
      case "input":
        return (
          <InputBaseShow
            question={question as InputQuestion}
            withHeader={withHeader}
            showAnswer={showCorrect}
          />
        );
      case "order":
        return (
          <OrderBaseShow
            data={(question as OrderQuestion).config}
            showCorrect={showCorrect}
          />
        );
      case "pin":
        return (
          <PinQuestionShow
            question={question as PinQuestion}
            answers={answers}
            showAnswer={showCorrect}
            withHeader={withHeader}
          />
        );
      case "buzzer":
      case "none":
        return (
          <BuzzerBaseShow
            question={question as BuzzerQuestion}
            withHeader={withHeader}
            showAnswer={showCorrect}
          />
        );
      default:
        return <div></div>;
    }
  }, [question, withHeader, showCorrect]);

  return (
    <div
      className={
        "bg-gray-800 border-teal-700 border-4 rounded-3xl w-7/8 flex-1 min-h-0 self-center flex flex-col text-5xl"
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
