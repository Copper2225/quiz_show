import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import MediaUploadOrSelect from "~/routes/edit/components/MediaEdit/MediaUploadOrSelect";
import { Checkbox } from "~/components/ui/checkbox";

interface Props {
  index: number;
  deleteRow: () => void;
  elements: number;
  defaultValue: string;
  defaultFile: string;
  defaultShowText: boolean;
}

const HigherLowerLine = ({
  index,
  deleteRow,
  elements,
  defaultValue,
  defaultShowText,
  defaultFile,
}: Props) => {
  return (
    <div className={"flex items-center gap-3"}>
      <Input
        className={"w-1/4"}
        name={`config.options.${index}.text`}
        defaultValue={defaultValue}
      />
      <MediaUploadOrSelect
        name={`config.options.${index}.imgSrc`}
        uploadName={`mediaFileUpload.${index}`}
        defaultData={defaultFile}
      />
      <Checkbox
        name={`config.options.${index}.showText`}
        id={"config.options.${index}.showText"}
        defaultChecked={defaultShowText}
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

export default HigherLowerLine;
