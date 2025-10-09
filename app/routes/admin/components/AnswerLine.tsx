import { Button } from "~/components/ui/button";
import { Ban, Eye, EyeOff, LockOpen, Trash } from "lucide-react";
import { format } from "date-fns";
import { useFetcher } from "react-router";
import { useCallback, useMemo } from "react";
import { type Question } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import { Checkbox } from "~/components/ui/checkbox";
import { useGetAnswerString } from "~/utils/useGetAnswerString";

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
    return useGetAnswerString(valueAnswer, question, questionRevealTime);
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
