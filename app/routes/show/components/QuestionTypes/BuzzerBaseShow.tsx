import React, { useMemo } from "react";
import ShowText from "~/routes/show/components/ShowText";
import type { BuzzerQuestion } from "~/types/adminTypes";
import { QuestionType } from "~/types/question";

interface Props {
  question: BuzzerQuestion;
  withHeader: boolean;
  showAnswer: boolean;
  answers: Map<string, { answer: string; time: Date }>;
}

const BuzzerBaseShow = ({
  question,
  withHeader,
  showAnswer,
  answers,
}: Props) => {
  const hasOneBuzzered = useMemo(() => {
    if (!(question?.type === QuestionType.BUZZER)) return false;
    return Array.from(answers.values()).some(
      (answer) => answer.answer === "buzzer",
    );
  }, [answers, question?.type]);

  console.log(answers);

  return (
    <div className={"flex flex-1 p-4 gap-4 overflow-hidden"}>
      {question.config?.media?.mediaChecked && (
        <div
          className={`${showAnswer ? "min-w-3/5" : "w-full"} content-center h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12`}
        >
          <img
            className={`h-full justify-self-center object-contain ${hasOneBuzzered ? "blur-3xl" : ""}`}
            src={question.config?.media?.mediaFile}
            alt={"Media"}
          />
        </div>
      )}
      {!withHeader && !showAnswer && <ShowText>{question.prompt}</ShowText>}
      {showAnswer && (
        <ShowText textColor={"var(--color-emerald-500)"}>
          {question.config.answer}
        </ShowText>
      )}
    </div>
  );
};

export default BuzzerBaseShow;
