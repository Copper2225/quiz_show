import { Button } from "~/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import HiddenText from "~/routes/admin/components/HiddenText";
import { type Question, QuestionType } from "~/types/question";
import {
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  SquareCheckBig,
  Trash,
} from "lucide-react";
import AnswerLine from "~/routes/admin/components/AnswerLine";
import type { PinQuestion } from "~/types/adminTypes";
import type { JsonValue } from "@prisma/client/runtime/client";
import {
  useGetAnswerString,
  useGetSolutionString,
} from "~/utils/useGetAnswerString";

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
  const fetcher = useFetcher();
  const [correctAnswers, setCorrectAnswers] = useState<Map<string, boolean>>(
    new Map(),
  );
  const clearEvent = useEventSource("/sse/events", { event: "clearAnswers" });
  const revealEvent = useEventSource("/sse/events", { event: "reveal" });
  const answerEvent = useEventSource("/sse/events/admin", { event: "answer" });
  const revalidator = useRevalidator();

  useEffect(() => {
    revalidator.revalidate();
  }, [clearEvent, revealEvent, answerEvent]);

  const clearAnswers = useCallback(async () => {
    await fetcher.submit("clear", {
      method: "post",
      action: "/api/clearAnswers",
    });
  }, [fetcher]);

  const revealAnswer = useCallback(() => {
    const formData = new FormData();
    formData.set("revealed", (!revealedOrHidden).toString());
    fetcher.submit(formData, {
      method: "post",
      action: "/api/reveal",
    });
  }, [revealedOrHidden, fetcher]);

  const allAnswersRevealed = useMemo(() => {
    return Array.from(userReveals.values()).every((revealed) => revealed);
  }, [userReveals]);

  const revealAllPlayerAnswers = useCallback(() => {
    const formData = new FormData();
    formData.append("all", JSON.stringify(true));
    formData.append("reveal", JSON.stringify(!allAnswersRevealed));
    fetcher.submit(formData, {
      method: "post",
      action: "/api/userReveal",
    });
  }, [allAnswersRevealed]);

  const correctAnswerString = useMemo(() => {
    return useGetSolutionString(question);
  }, [question]);

  const handleLockAnswers = useCallback(() => {
    const formData = new FormData();
    formData.append("setAll", "true");
    formData.append("locked", unlockOrLock ? "false" : "true");
    fetcher.submit(formData, {
      method: "post",
      action: "/api/lockAnswers",
    });
  }, [unlockOrLock]);

  const onAddClick = useCallback(async () => {
    if (question) {
      const formData = new FormData();
      formData.append(
        "teams",
        JSON.stringify(
          Array.from(correctAnswers.keys()).filter((team) =>
            correctAnswers.get(team),
          ),
        ),
      );
      formData.append("points", question.points.toString());

      await fetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
    }
  }, [question, correctAnswers]);

  useEffect(() => {
    if (!answers || !question) return;

    const correctMap = new Map<string, boolean>();

    for (const [team, answer] of answers) {
      let isCorrect = false;

      switch (question.type) {
        case QuestionType.INPUT:
        case QuestionType.BUZZER:
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.ORDER: {
          isCorrect =
            useGetAnswerString(answer, question, questionRevealTime) ===
            useGetSolutionString(question);
          break;
        }

        case QuestionType.PIN: {
          try {
            const correctPin = (question as PinQuestion).config.pin;
            const teamPin = JSON.parse(answer.answer) as typeof correctPin;

            const tolerance = 2; // percent
            const dx = Math.abs(correctPin.xPercent - teamPin.xPercent);
            const dy = Math.abs(correctPin.yPercent - teamPin.yPercent);

            isCorrect = dx <= tolerance && dy <= tolerance;
          } catch {
            isCorrect = false;
          }
          break;
        }

        default:
          isCorrect = false;
      }

      correctMap.set(team, isCorrect);
    }

    setCorrectAnswers(correctMap);
  }, [answers, question]);

  return (
    <>
      {correctAnswerString && <HiddenText text={correctAnswerString} />}
      <div className={"flex gap-2"}>
        <Button
          className={"lg:text-2xl xl:text-3xl h-full flex-1"}
          onClick={revealAnswer}
        >
          {revealedOrHidden ? "Lösung verbergen" : "Lösung zeigen"}
        </Button>
      </div>
      <ul className={"h-3/10 flex flex-col gap-3 overflow-y-scroll"}>
        {Array.from(teams.keys()).map((name) => (
          <AnswerLine
            key={name}
            name={name}
            valueAnswer={answers.get(name)}
            answerRevealed={userReveals.get(name) ?? false}
            userLocked={userLocks.get(name) ?? false}
            question={question}
            correct={correctAnswers}
            questionRevealTime={questionRevealTime}
            setCorrectAnswers={setCorrectAnswers}
          />
        ))}
      </ul>
      <div className={"flex gap-2 flex-wrap mb-3"}>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={handleLockAnswers}
        >
          {unlockOrLock ? (
            <LockOpen className={"size-4 lg:size-6"} />
          ) : (
            <Lock className={"size-4 lg:size-6"} />
          )}
        </Button>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={revealAllPlayerAnswers}
        >
          <span className={"flex items-center h-full gap-2 "}>
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
          <Trash className={"size-4 lg:size-6"} />
        </Button>
        <Button
          className={"lg:text-2xl xl:text-3xl flex-1 h-full max-h-[3em]"}
          onClick={onAddClick}
        >
          <SquareCheckBig className={"size-4 lg:size-6"} />
        </Button>
      </div>
    </>
  );
};

export default Answers;
