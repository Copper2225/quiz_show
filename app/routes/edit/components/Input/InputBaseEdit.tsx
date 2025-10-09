import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { InputQuestion } from "~/types/adminTypes";

interface Props {
  question?: InputQuestion;
}

const InputBaseEdit = ({ question }: Props) => {
  return (
    <div>
      <Label htmlFor={"config.answer"} className={"mb-2"}>
        Lösung
      </Label>
      <Input
        name={"config.answer"}
        id={"config.answer"}
        defaultValue={question?.config.answer}
      />
    </div>
  );
};

export default InputBaseEdit;
