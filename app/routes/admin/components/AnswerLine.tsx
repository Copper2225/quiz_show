import { Button } from "~/components/ui/button";
import { Ban, Eye, EyeOff, LockOpen, Trash } from "lucide-react";
import { format } from "date-fns";
import { useFetcher } from "react-router";
import { useCallback, useMemo } from "react";
import { type Question, QuestionType } from "~/types/question";
import type { PinData, PinQuestion } from "~/types/adminTypes";
import type { JsonValue } from "@prisma/client/runtime/client";
import { Checkbox } from "~/components/ui/checkbox";

interface Props {
  name: string;
  valueAnswer: { answer: string; time: Date } | undefined;
  question: Question<JsonValue> | null;
  questionRevealTime: Date | null;
  answerRevealed: boolean;
  userLocked: boolean;
  correct: boolean;
}

const AnswerLine = ({
  name,
  valueAnswer,
  questionRevealTime,
  question,
  answerRevealed,
  userLocked,
  correct,
}: Props) => {
  const fetcher = useFetcher();
  const blockFetcher = useFetcher();

  const revealAnswer = useCallback(() => {
    const formData = new FormData();
    formData.append("user", name);
    formData.append("reveal", JSON.stringify(!answerRevealed));
    fetcher.submit(formData, {
      method: "post",
      action: "/api/userReveal",
    });
  }, [name, answerRevealed]);

  const lockAnswer = useCallback(() => {
    const formData = new FormData();
    formData.append("user", name);
    formData.append("block", JSON.stringify(!userLocked));
    blockFetcher.submit(formData, {
      method: "post",
      action: "/api/userBlock",
    });
  }, [name, userLocked]);

  const clearUserAnswer = useCallback(() => {
    const formData = new FormData();
    formData.append("user", name);
    formData.append("clear", "true");
    blockFetcher.submit(formData, {
      method: "post",
      action: "/api/userBlock",
    });
  }, [name, userLocked]);

  const answerString = useMemo(() => {
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
    }
    return valueAnswer?.answer;
  }, [question, valueAnswer, questionRevealTime]);

  return (
    <li key={name} className={"flex gap-3 items-center"}>
      <Checkbox checked={correct} />
      <Button onClick={revealAnswer}>
        {answerRevealed ? <EyeOff /> : <Eye />}
      </Button>
      <Button onClick={lockAnswer}>
        {userLocked ? <LockOpen /> : <Ban />}
      </Button>
      <Button onClick={clearUserAnswer}>
        <Trash />
      </Button>

      <span>
        {name}:{" "}
        {valueAnswer && (
          <span>
            {answerString} –– {format(valueAnswer.time, "HH:mm:ss:SSS", {})}
          </span>
        )}
      </span>
    </li>
  );
};

export default AnswerLine;
