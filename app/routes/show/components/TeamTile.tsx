import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import { useMemo } from "react";
import { useGetAnswerString } from "~/utils/useGetAnswerString";

interface Props {
  name: string;
  points: number;
  answer: { answer: string; time: Date } | undefined;
  showAnswer: boolean;
  question: Question<JsonValue> | null;
  highlighted?: boolean;
  questionRevealTime: Date | null;
  color?: string;
  position?: string;
}

const CAMS = false;

const TeamTile = ({
  name,
  points,
  showAnswer,
  question,
  answer,
  highlighted = false,
  color,
  questionRevealTime,
  position,
}: Props) => {
  const answerString = useMemo(() => {
    if (!answer) return undefined;
    return useGetAnswerString(answer, question, questionRevealTime);
  }, [question, answer, questionRevealTime]);

  return (
    <div
      className={`self-end py-1 px-5  text-3xl text-center flex-1 flex flex-col rounded-t-2xl ${
        highlighted ? "bg-(--tertiary)" : "bg-secondary"
      }`}
      style={{
        background: color !== undefined ? color : undefined,
      }}
    >
      {CAMS && (
        <div
          className={
            "rounded-2xl self-center h-40 w-fit aspect-video bg-gray-300/30 mb-2"
          }
        ></div>
      )}
      {((answerString && showAnswer) || position) && (
        <div
          className={`mb-2 p-2 bg-white/20 rounded text-3xl ${question?.type === QuestionType.HIGHER_LOWER ? "text-red-500" : ""}`}
        >
          {question?.type === QuestionType.HIGHER_LOWER && position ? (
            <span className="text-white font-bold">{position}</span>
          ) : (
            answerString
          )}
        </div>
      )}
      <span>{name}</span>
      <span className={"text-2xl"}>{points}</span>
    </div>
  );
};

export default TeamTile;
