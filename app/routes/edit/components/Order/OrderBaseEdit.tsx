import { useCallback, useState } from "react";
import { Label } from "~/components/ui/label";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import OrderLine from "~/routes/edit/components/Order/OrderLine";
import type { OrderQuestion } from "~/types/adminTypes";

interface Props {
  question?: OrderQuestion;
}

const OrderBaseEdit = ({ question }: Props) => {
  const [elements, setElements] = useState<number>(
    question?.config.options?.length ?? 2,
  );

  const deleteRow = useCallback(() => {
    setElements((prevElements) => prevElements - 1);
  }, []);
  const addRow = useCallback(() => {
    setElements((prevElements) => prevElements + 1);
  }, []);

  return (
    <>
      <div>
        <Label className={"mb-2"}>Elements</Label>
        <div className={"flex flex-col gap-2"}>
          {Array.from({ length: elements }).map((_e, index) => (
            <OrderLine
              index={index}
              deleteRow={deleteRow}
              elements={elements}
              defaultConfig={question?.config}
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
          Add new element
        </Button>
      </div>
    </>
  );
};

export default OrderBaseEdit;
