import { useCallback, useMemo, useState } from "react";
import { Label } from "~/components/ui/label";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import OrderLine from "~/routes/edit/components/Order/OrderLine";
import type { OrderQuestion } from "~/types/adminTypes";
import { Reorder, ReorderItem } from "@yamada-ui/reorder";

interface Props {
  question?: OrderQuestion;
}

type DraggableOption = {
  text: string;
  id: string;
};

const OrderBaseEdit = ({ question }: Props) => {
  const initialOptions = useMemo(() => {
    return (
      question?.config?.options?.map((o, i) => ({
        text: o,
        id: `option-${i}-${Date.now()}`,
      })) ?? [
        { text: "", id: `option-0-${Date.now()}` },
        { text: "", id: `option-1-${Date.now()}` },
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
      { text: "", id: `option-${prev.length}-${Date.now()}` },
    ]);
  }, []);

  const handleDragChange = useCallback((values: DraggableOption[]) => {
    setElements(values);
  }, []);

  return (
    <>
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
                  <OrderLine
                    index={index}
                    deleteRow={() => deleteRow(element.id)}
                    elements={elements.length}
                    defaultValue={element.text}
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

export default OrderBaseEdit;
