import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState, Fragment, useCallback } from "react";
import type { QuestionEntity } from "@prisma/client";
import { SquareDashedMousePointer } from "lucide-react";

interface Props {
  categories: string[];
  activeMatrix: boolean[][];
  grid: Map<string, QuestionEntity>;
}

const QuestionSelect = ({ categories, activeMatrix, grid }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"open" | "switch">("open");

  const handleOpenClick = useCallback(() => {
    setMode("open");
  }, []);

  const handleSwitchClick = useCallback(() => {
    setMode("switch");
  }, []);

  const selectFetcher = useFetcher();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className={"flex gap-2"}>
            <Button onClick={handleOpenClick} className={"flex-1"}>
              OPEN
            </Button>
            <Button onClick={handleSwitchClick}>
              <SquareDashedMousePointer />
            </Button>
          </div>
        </DialogTrigger>
        <selectFetcher.Form
          method={"post"}
          action={"/api/question"}
          className={"flex flex-col"}
        >
          <input hidden readOnly name={"type"} value={"none"} />
          <input hidden name="mode" value={mode} readOnly />
          <Button onClick={handleOpenClick} type={"submit"}>
            Clear Question
          </Button>
        </selectFetcher.Form>

        <DialogContent className={"sm:max-w-[90%] sm:max-h-[80%]"}>
          <DialogHeader>
            <DialogTitle>Select Question</DialogTitle>
          </DialogHeader>
          <div
            className="grid gap-4 w-full flex-1"
            style={{
              gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${activeMatrix[0]?.length + 1}, minmax(0, 1fr))`,
              gridAutoFlow: "column dense",
            }}
          >
            {categories.map((cate, colIndex) => {
              return (
                <Fragment key={colIndex}>
                  <Button
                    variant={"outline"}
                    className={`w-full overflow-hidden whitespace-break-spaces text-3xl h-full flex items-center justify-center border-2 !border-primary`}
                  >
                    {cate}
                  </Button>
                  {Array.from({ length: 3 }, (_, rowIndex) => (
                    <selectFetcher.Form
                      key={`row ${rowIndex}`}
                      method={"post"}
                      action={"/api/question"}
                      onSubmit={
                        mode === "open" ? () => setOpen(false) : undefined
                      }
                    >
                      <input hidden name="mode" value={mode} readOnly />
                      <input
                        readOnly
                        hidden
                        name="data"
                        value={JSON.stringify({
                          col: colIndex,
                          row: rowIndex,
                        })}
                      />
                      <Button
                        className={`w-full text-4xl h-full flex items-center justify-center ${!activeMatrix[colIndex][rowIndex] && "bg-teal-950 hover:bg-teal-950"}`}
                        type={"submit"}
                      >
                        {grid.get(`${colIndex}:${rowIndex}`)?.points ??
                          (rowIndex + 1) * 100}
                      </Button>
                    </selectFetcher.Form>
                  ))}
                </Fragment>
              );
            })}
          </div>
          {mode == "switch" && (
            <selectFetcher.Form method={"post"} action={"/api/question"}>
              <input hidden name="mode" value={mode} readOnly />
              <input readOnly hidden name="reset" value={"true"} />
              <Button
                className={`w-full text-4xl h-full flex items-center justify-center`}
                type={"submit"}
              >
                Reset
              </Button>
            </selectFetcher.Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionSelect;
