import { TableCell, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";

interface Props {
  index: number;
  removeAnswer: () => void;
  defaultValues: { name: string; checked?: "on" | "off" };
  answers: number;
}

const OptionLine = ({ index, removeAnswer, defaultValues, answers }: Props) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Input
          name={`config.options.${index}.name`}
          id={`config.options.${index}.name`}
          defaultValue={defaultValues.name}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          name={`config.options.${index}.checked`}
          id={`config.options.${index}.checked`}
          defaultChecked={defaultValues.checked === "on"}
        />
      </TableCell>
      <TableCell>
        {index === answers - 1 && (
          <Button type={"button"} variant={"secondary"} onClick={removeAnswer}>
            -
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default OptionLine;
