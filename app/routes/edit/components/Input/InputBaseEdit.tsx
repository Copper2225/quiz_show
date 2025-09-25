import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface Props {
  defaultConfig?: any;
}

const InputBaseEdit = ({ defaultConfig }: Props) => {
  return (
    <div>
      <Label htmlFor={"config.answer"} className={"mb-2"}>
        Answer
      </Label>
      <Input
        name={"config.answer"}
        id={"config.answer"}
        defaultValue={defaultConfig?.answer}
      />
    </div>
  );
};

export default InputBaseEdit;
