import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import { useMemo } from "react";
import type { PinData, PinQuestion } from "~/types/adminTypes";

interface Props {
  name: string;
  points: number;
  answer: { answer: string; time: Date } | undefined;
  showAnswer: boolean;
  question: Question<JsonValue> | null;
  highlighted?: boolean;
  questionRevealTime: Date | null;
  color?: string;
}

const TeamTile = ({
  name,
  points,
  showAnswer,
  question,
  answer,
  highlighted = false,
  color,
  questionRevealTime,
}: Props) => {
  const answerString = useMemo(() => {
    if (!answer) return undefined;
    if (question?.type === QuestionType.BUZZER && questionRevealTime !== null) {
      return (
        (
          Math.abs(questionRevealTime.getTime() - answer.time.getTime()) / 1000
        ).toString() + " s"
      );
    } else if (question?.type === QuestionType.PIN) {
      const answerPin = JSON.parse(answer.answer) as PinData;
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

      return (Math.round(dist * 100) / 100).toString() + " px";
    }
    return answer?.answer;
  }, [question, answer, questionRevealTime]);

  return (
    <div
      className={`self-end p-5 text-3xl text-center flex-1 flex flex-col rounded-t-2xl ${
        highlighted ? "bg-orange-500" : "bg-purple-700"
      }`}
      style={{
        background: color !== undefined ? color : undefined,
      }}
    >
      {answerString && showAnswer && (
        <div className={"mb-2 p-2 bg-white/20 rounded text-2xl"}>
          {answerString}
        </div>
      )}
      <span>{name}</span>
      <span className={"text-2xl"}>{points}</span>
    </div>
  );
};

export default TeamTile;
