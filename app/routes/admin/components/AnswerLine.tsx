import { Button } from "~/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { useFetcher } from "react-router";
import { useCallback } from "react";

interface Props {
  name: string;
  valueAnswer: { answer: string; time: Date };
  answerRevealed: boolean;
}

const AnswerLine = ({ name, valueAnswer, answerRevealed }: Props) => {
  const revealFetcher = useFetcher();

  const revealAnswer = useCallback(() => {
    const formData = new FormData();
    formData.append("user", name);
    formData.append("reveal", JSON.stringify(!answerRevealed));
    revealFetcher.submit(formData, {
      method: "post",
      action: "/api/userReveal",
    });
  }, [name, answerRevealed]);

  return (
    <li key={name} className={"flex gap-3 items-center"}>
      <Button onClick={revealAnswer}>
        {answerRevealed ? <EyeOff /> : <Eye />}
      </Button>
      <span>
        {name}: {valueAnswer.answer} ––{" "}
        {format(valueAnswer.time, "HH:mm:ss:SSS", {})}
      </span>
    </li>
  );
};

export default AnswerLine;
