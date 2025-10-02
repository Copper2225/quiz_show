import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  index: number;
  deleteRow: () => void;
  elements: number;
  defaultConfig: any;
}

const OrderLine = ({ index, deleteRow, elements, defaultConfig }: Props) => {
  return (
    <div className={"flex items-center gap-3"}>
      <Input
        name={`config.options.${index}`}
        defaultValue={defaultConfig?.options[index]}
      />

      <Button
        variant="ghost"
        size="icon"
        type={"button"}
        onClick={deleteRow}
        disabled={elements - 1 !== index}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default OrderLine;
