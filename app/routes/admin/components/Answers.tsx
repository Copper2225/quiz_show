import { Button } from "~/components/ui/button";
import { useCallback, useEffect, useMemo } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import HiddenText from "~/routes/admin/components/HiddenText";
import { type Question, QuestionType } from "~/types/question";
import { Eye, EyeOff } from "lucide-react";
import AnswerLine from "~/routes/admin/components/AnswerLine";
import type {
  BuzzerQuestion,
  InputQuestion,
  MultipleChoiceQuestion,
  OrderQuestion,
  PinQuestion,
} from "~/types/adminTypes";
import type { JsonValue } from "@prisma/client/runtime/client";

interface Props {
  unlockOrLock: boolean;
  revealedOrHidden: boolean;
  answers: Map<string, { answer: string; time: Date }>;
  question: Question<JsonValue> | null;
  userReveals: Map<string, boolean>;
  userLocks: Map<string, boolean>;
  teams: Map<string, number>;
  questionRevealTime: Date | null;
}

const Answers = ({
  unlockOrLock,
  revealedOrHidden,
  answers,
  question,
  userReveals,
  userLocks,
  teams,
  questionRevealTime,
}: Props) => {
  const answersFetcher = useFetcher();

  const clearEvent = useEventSource("/sse/events", { event: "clearAnswers" });
  const revealEvent = useEventSource("/sse/events", { event: "reveal" });
  const answerEvent = useEventSource("/sse/events/admin", { event: "answer" });
  const revalidator = useRevalidator();

  useEffect(() => {
    revalidator.revalidate();
  }, [clearEvent, revealEvent, answerEvent]);

  const clearAnswers = useCallback(async () => {
    await answersFetcher.submit("clear", {
      method: "post",
      action: "/api/clearAnswers",
    });
  }, [answersFetcher]);

  const revealAnswer = useCallback(() => {
    const formData = new FormData();
    formData.set("revealed", (!revealedOrHidden).toString());
    answersFetcher.submit(formData, {
      method: "post",
      action: "/api/reveal",
    });
  }, [revealedOrHidden, answersFetcher]);

  const allAnswersRevealed = useMemo(() => {
    return Array.from(userReveals.values()).every((revealed) => revealed);
  }, [userReveals]);

  const revealAllPlayerAnswers = useCallback(() => {
    const formData = new FormData();
    formData.append("all", JSON.stringify(true));
    formData.append("reveal", JSON.stringify(!allAnswersRevealed));
    answersFetcher.submit(formData, {
      method: "post",
      action: "/api/userReveal",
    });
  }, [revealedOrHidden, allAnswersRevealed]);

  const correctAnswerString = useMemo(() => {
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
              (question as OrderQuestion).config.shuffledOptions.indexOf(
                answer,
              ) + 1,
          )
          .toString();
      case QuestionType.MULTIPLE_CHOICE:
        return (question as MultipleChoiceQuestion).config.options
          .filter((e) => e.checked)
          .map((e) => e.name)
          .toString();
      default:
        return null;
    }
  }, [question]);

  const handleLockAnswers = useCallback(() => {
    const formData = new FormData();
    formData.append("setAll", "true");
    formData.append("locked", unlockOrLock ? "false" : "true");
    answersFetcher.submit(formData, {
      method: "post",
      action: "/api/lockAnswers",
    });
  }, [unlockOrLock]);

  return (
    <>
      {correctAnswerString && <HiddenText text={correctAnswerString} />}
      <div className={"flex gap-2"}>
        <Button
          className={"lg:text-2xl xl:text-3xl h-full flex-1"}
          onClick={revealAnswer}
        >
          {revealedOrHidden ? "Hide Answer" : "Reveal Answer"}
        </Button>
      </div>
      <ul className={"h-1/4 flex flex-col gap-3 overflow-y-scroll"}>
        {Array.from(teams.keys()).map((name) => (
          <AnswerLine
            key={name}
            name={name}
            valueAnswer={answers.get(name)}
            answerRevealed={userReveals.get(name) ?? false}
            userLocked={userLocks.get(name) ?? false}
            question={question}
            questionRevealTime={questionRevealTime}
          />
        ))}
      </ul>
      <div className={"flex gap-2 flex-wrap mb-3"}>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={handleLockAnswers}
        >
          {unlockOrLock ? "Unlock Answers" : "Lock Answers"}
        </Button>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={revealAllPlayerAnswers}
        >
          <span className={"flex items-center h-full gap-2 "}>
            Reveal All Player Answers
            {allAnswersRevealed ? (
              <EyeOff className={"size-4 lg:size-6"} />
            ) : (
              <Eye className={"size-4 lg:size-6"} />
            )}
          </span>
        </Button>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={clearAnswers}
        >
          Clear answers
        </Button>
      </div>
    </>
  );
};

export default Answers;
