import { Button } from "~/components/ui/button";
import { Ban, Eye, EyeOff, LockOpen, Trash } from "lucide-react";
import { format } from "date-fns";
import { useFetcher } from "react-router";
import { useCallback } from "react";

interface Props {
  name: string;
  valueAnswer: { answer: string; time: Date } | undefined;
  answerRevealed: boolean;
  userLocked: boolean;
}

const AnswerLine = ({
  name,
  valueAnswer,
  answerRevealed,
  userLocked,
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

  return (
    <li key={name} className={"flex gap-3 items-center"}>
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
            {valueAnswer.answer} ––{" "}
            {format(valueAnswer.time, "HH:mm:ss:SSS", {})}
          </span>
        )}
      </span>
    </li>
  );
};

export default AnswerLine;
