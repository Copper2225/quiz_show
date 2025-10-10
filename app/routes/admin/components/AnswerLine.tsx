import { Button } from "~/components/ui/button";
import { Ban, Eye, EyeOff, LockOpen, Trash } from "lucide-react";
import { format } from "date-fns";
import { useFetcher } from "react-router";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";
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
  correct: Map<string, boolean>;
  setCorrectAnswers: Dispatch<SetStateAction<Map<string, boolean>>>;
}

const AnswerLine = ({
  name,
  valueAnswer,
  questionRevealTime,
  question,
  answerRevealed,
  userLocked,
  correct,
  setCorrectAnswers,
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

  const handleCheckChange = useCallback(() => {
    setCorrectAnswers((prev) => {
      const newCorrectAnswers = new Map(prev);
      const newValue = !(prev.get(name) ?? false);
      newCorrectAnswers.set(name, newValue);
      return newCorrectAnswers;
    });
  }, [name]);

  const checked = useMemo(() => {
    return correct.get(name) ?? false;
  }, [correct, name]);

  return (
    <li key={name} className={"flex gap-3 items-center"}>
      <Checkbox onCheckedChange={handleCheckChange} checked={checked} />
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
