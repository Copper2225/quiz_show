import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import MediaUploadOrSelect from "~/routes/edit/components/MediaEdit/MediaUploadOrSelect";
import { Checkbox } from "~/components/ui/checkbox";

interface Props {
  index: number;
  deleteRow: () => void;
  defaultValue: string;
  defaultFile: string;
  defaultShowText: boolean;
  defaultLabel: string;
}

const HigherLowerLine = ({
  index,
  deleteRow,
  defaultValue,
  defaultShowText,
  defaultFile,
  defaultLabel,
}: Props) => {
  return (
    <div className={"flex items-center gap-3"}>
      <Input
        className={"w-1/6"}
        name={`config.options.${index}.label`}
        defaultValue={defaultLabel}
        placeholder={"Label"}
      />
      <Input
        className={"w-1/10"}
        name={`config.options.${index}.value`}
        defaultValue={defaultValue}
        placeholder={"Value"}
      />
      <div className="flex-1 min-w-0">
        <MediaUploadOrSelect
          name={`config.options.${index}.imgSrc`}
          uploadName={`mediaFileUpload.${index}`}
          defaultData={defaultFile}
        />
      </div>
      <Checkbox
        name={`_check_config.options.${index}.showText`}
        id={"_check_config.options.${index}.showText"}
        defaultChecked={defaultShowText}
      />
      <Button variant="ghost" size="icon" type={"button"} onClick={deleteRow}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default HigherLowerLine;
