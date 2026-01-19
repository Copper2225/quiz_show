import { useCallback, useMemo, useState } from "react";
import { Label } from "~/components/ui/label";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import type {
  HigherLowerOption,
  HigherLowerQuestion,
} from "~/types/adminTypes";
import HigherLowerLine from "~/routes/edit/components/HigherLower/HigherLowerLine";
import { Input } from "~/components/ui/input";
import { Reorder, ReorderItem } from "@yamada-ui/reorder";

interface Props {
  question?: HigherLowerQuestion;
}

type DraggableOption = HigherLowerOption & { id: string };

const HigherLowerBaseEdit = ({ question }: Props) => {
  const initialOptions = useMemo(() => {
    return (
      question?.config?.options?.map((o, i) => ({
        ...o,
        id: `option-${i}-${Date.now()}`,
      })) ?? [
        {
          text: "",
          imgSrc: "",
          show: false,
          showText: false,
          id: `option-0-${Date.now()}`,
        },
        {
          text: "",
          imgSrc: "",
          show: false,
          showText: false,
          id: `option-1-${Date.now()}`,
        },
      ]
    );
  }, [question]);

  const [elements, setElements] = useState<DraggableOption[]>(initialOptions);

  const deleteRow = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  const addRow = useCallback(() => {
    setElements((prev) => [
      ...prev,
      {
        text: "",
        imgSrc: "",
        show: false,
        showText: false,
        id: `option-${prev.length}-${Date.now()}`,
      },
    ]);
  }, []);

  const handleDragChange = useCallback((values: DraggableOption[]) => {
    setElements(values);
  }, []);

  return (
    <>
      <div>
        <Label htmlFor={"config.lowLabel"} className={"mb-2"}>
          Low-Label
        </Label>
        <Input
          name={"config.lowLabel"}
          id={"config.lowLabel"}
          defaultValue={question?.config?.lowLabel}
        />
      </div>
      <div>
        <Label htmlFor={"config.highLabel"} className={"mb-2"}>
          High-Label
        </Label>
        <Input
          name={"config.highLabel"}
          id={"config.highLabel"}
          defaultValue={question?.config?.highLabel}
        />
      </div>
      <div>
        <Label className={"mb-2"}>Elemente</Label>
        <Reorder
          className={"flex flex-col gap-2"}
          onCompleteChange={handleDragChange}
        >
          {elements.map((element, index) => (
            <ReorderItem key={element.id} value={element}>
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <div className="flex-1">
                  <HigherLowerLine
                    index={index}
                    deleteRow={() => deleteRow(element.id)}
                    defaultFile={element.imgSrc ?? ""}
                    defaultValue={element.text ?? ""}
                    defaultShowText={element.showText ?? false}
                  />
                </div>
              </div>
            </ReorderItem>
          ))}
        </Reorder>

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
