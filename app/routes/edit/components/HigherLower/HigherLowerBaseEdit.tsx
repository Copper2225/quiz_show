import { useCallback, useMemo, useState } from "react";
import { Label } from "~/components/ui/label";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import OrderLine from "~/routes/edit/components/Order/OrderLine";
import type { HigherLowerQuestion, OrderQuestion } from "~/types/adminTypes";
import HigherLowerLine from "~/routes/edit/components/HigherLower/HigherLowerLine";

interface Props {
  question?: HigherLowerQuestion;
}

const HigherLowerBaseEdit = ({ question }: Props) => {
  const [elements, setElements] = useState<number>(
    question?.config.options?.length ?? 2,
  );

  const deleteRow = useCallback(() => {
    setElements((prevElements) => prevElements - 1);
  }, []);
  const addRow = useCallback(() => {
    setElements((prevElements) => prevElements + 1);
  }, []);

  const options = useMemo(() => {
    return question?.config?.options ?? [];
  }, [question]);

  console.log(options);

  return (
    <>
      <div>
        <Label className={"mb-2"}>Elemente</Label>
        <div className={"flex flex-col gap-2"}>
          {Array.from({ length: elements }).map((_e, index) => (
            <HigherLowerLine
              index={index}
              deleteRow={deleteRow}
              elements={elements}
              defaultFile={options[index]?.imgSrc ?? ""}
              defaultValue={options[index]?.text ?? ""}
              defaultShowText={options[index]?.showText ?? false}
            />
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-2 w-full justify-start text-muted-foreground"
          type={"button"}
          onClick={addRow}
        >
          <Plus className="h-4 w-4 mr-2" />
          Neues Element
        </Button>
      </div>
    </>
  );
};

export default HigherLowerBaseEdit;
