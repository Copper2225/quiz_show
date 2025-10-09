import { FitGroup } from "~/routes/user/components/FitGroup";
import { Reorder, ReorderItem } from "@yamada-ui/reorder";
import { Button } from "~/components/ui/button";
import { GripHorizontal } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import type { UserOrderQuestion } from "~/types/userTypes";

interface Props {
  data: UserOrderQuestion;
  locked: boolean;
  answer: string | undefined;
  isPreview?: boolean;
}

const OrderField = ({ data, locked, answer, isPreview = false }: Props) => {
  const [testData, setTestData] = useState<string[]>([]);

  const loadedOrder = useMemo(() => {
    const options = data.config.shuffledOptions as string[];
    if (answer !== undefined) {
      const parsed = JSON.parse(answer) as number[];
      return parsed.map((idx) => options[idx - 1]);
    }
    return options;
  }, []);

  const submitFetcher = useFetcher();

  const handleDragChange = useCallback((values: string[]) => {
    return setTestData(values);
  }, []);

  const submitData = useCallback(() => {
    const formData = new FormData();
    formData.append(
      "answer",
      JSON.stringify(
        testData.map((e) => data.config.shuffledOptions.indexOf(e) + 1),
      ),
    );
    submitFetcher.submit(formData, {
      method: "POST",
      action: "/api/answer",
    });
  }, [testData]);

  return (
    <div className={"h-full flex flex-col"}>
      <div className="flex-1 min-h-0">
        <FitGroup texts={loadedOrder}>
          {(fontSize, getRef, getWrapperRef) => (
            <>
              <Reorder
                className={
                  "h-full w-full grid gap-3 touch-manipulation overflow-hidden"
                }
                onCompleteChange={handleDragChange}
              >
                {loadedOrder.map((choice: string, index: number) => (
                  <ReorderItem
                    value={choice}
                    className={"flex h-full overflow-hidden"}
                    drag={!locked}
                    key={index}
                  >
                    <div
                      className={`w-full bg-background h-full rounded-2xl outline-4 outline-solid -outline-offset-12 p-4 ps-2 items-center flex ${locked && "opacity-50"}`}
                      ref={getWrapperRef(index)}
                    >
                      <div
                        ref={getRef(index)}
                        className={`w-full h-full content-center px-5 whitespace-pre-wrap overflow-hidden`}
                        style={{ fontSize }}
                      >
                        {choice}
                      </div>
                      <GripHorizontal size={30} className={`me-3`} />
                    </div>
                  </ReorderItem>
                ))}
              </Reorder>
            </>
          )}
        </FitGroup>
      </div>
      <div className="mt-4 shrink-0">
        <Button
          disabled={locked || isPreview}
          className={"w-full h-[100px] text-5xl"}
          onClick={submitData}
        >
          Absenden
        </Button>
      </div>
    </div>
  );
};

export default OrderField;
