import { Label } from "~/components/ui/label";
import type { BuzzerQuestion } from "~/types/adminTypes";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  question?: BuzzerQuestion;
}

const BuzzerBaseEdit = ({ question }: Props) => {
  return (
    <div>
      <Label htmlFor={"config.answer"} className={"mb-2"}>
        Lösung
      </Label>
      <Textarea
        name={"config.answer"}
        id={"config.answer"}
        defaultValue={question?.config?.answer}
      />
    </div>
  );
};

export default BuzzerBaseEdit;
