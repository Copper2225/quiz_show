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

interface Props {
  unlockOrLock: boolean;
  revealedOrHidden: boolean;
  answers: Map<string, { answer: string; time: Date }>;
  question: Question<any> | null;
  userReveals: Map<string, boolean>;
}

const Answers = ({
  unlockOrLock,
  revealedOrHidden,
  answers,
  question,
  userReveals,
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
    console.log(question);
    switch (question.type) {
      case QuestionType.BUZZER:
        return (question as BuzzerQuestion).config.answer;
      case QuestionType.INPUT:
        return (question as InputQuestion).config.answer;
      case QuestionType.PIN:
        return JSON.stringify((question as PinQuestion).config.pin);
      case QuestionType.ORDER:
        return (question as OrderQuestion).config.options.toString();
      case QuestionType.MULTIPLE_CHOICE:
        return (question as MultipleChoiceQuestion).config.options
          .filter((e) => e.checked)
          .map((e) => e.name)
          .toString();
      default:
        return null;
    }
  }, [question]);

  return (
    <>
      {correctAnswerString && <HiddenText text={correctAnswerString} />}
      <Button onClick={revealAllPlayerAnswers}>
        Reveal All Player Answers
        {allAnswersRevealed ? <EyeOff /> : <Eye />}
      </Button>
      <ul className={"h-1/4 flex flex-col gap-3 overflow-y-scroll"}>
        {Array.from(answers.entries()).map(([key, value]) => (
          <AnswerLine
            key={key}
            name={key}
            valueAnswer={value}
            answerRevealed={userReveals.get(key) ?? false}
          />
        ))}
      </ul>
      <answersFetcher.Form
        method={"post"}
        action={"/api/lockAnswers"}
        className={"flex flex-col"}
      >
        <input hidden readOnly value={"true"} name={"setAll"} />
        <input
          hidden
          readOnly
          value={unlockOrLock ? "false" : "true"}
          name={"locked"}
        />
        <Button>{unlockOrLock ? "Unlock Answers" : "Lock Answers"}</Button>
      </answersFetcher.Form>
      <Button onClick={revealAnswer}>
        {revealedOrHidden ? "Hide Answer" : "Reveal Answer"}
      </Button>
      <Button onClick={clearAnswers}>Clear answers</Button>
    </>
  );
};

export default Answers;
