import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { BuzzerQuestion } from "~/types/adminTypes";

interface Props {
  question?: BuzzerQuestion;
}

const BuzzerBaseEdit = ({ question }: Props) => {
  return (
    <div>
      <Label htmlFor={"config.answer"} className={"mb-2"}>
        Answer
      </Label>
      <Input
        name={"config.answer"}
        id={"config.answer"}
        defaultValue={question?.config?.answer}
      />
    </div>
  );
};

export default BuzzerBaseEdit;
