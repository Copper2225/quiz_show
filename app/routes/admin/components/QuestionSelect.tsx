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
import { HatGlasses, SquareDashedMousePointer } from "lucide-react";
import type { Question } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";

interface Props {
  categories: string[];
  activeMatrix: boolean[][];
  grid: Map<string, Question<JsonValue>>;
}

const QuestionSelect = ({ categories, activeMatrix, grid }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"open" | "switch" | "peek">("open");

  const handleOpenClick = useCallback(() => {
    setMode("open");
  }, []);

  const handleSwitchClick = useCallback(() => {
    setMode("switch");
  }, []);

  const handlePeekClick = useCallback(() => {
    setMode("peek");
  }, []);

  const selectFetcher = useFetcher();

  return (
    <div className={"flex w-full gap-2"}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className={"flex gap-2 flex-1 h-full "}>
            <Button
              onClick={handleOpenClick}
              className={"flex-2 h-full lg:text-2xl xl:text-3xl"}
            >
              Frage öffnen
            </Button>
            <Button
              className={"h-full aspect-square"}
              onClick={handleSwitchClick}
            >
              <SquareDashedMousePointer
                className={"size-4 lg:size-5 xl:size-6"}
              />
            </Button>
            <Button
              className={"h-full aspect-square"}
              onClick={handlePeekClick}
            >
              <HatGlasses className={"size-4 lg:size-5 xl:size-6"} />
            </Button>
          </div>
        </DialogTrigger>
        <selectFetcher.Form
          method={"post"}
          action={"/api/question"}
          className={"flex flex-col flex-1"}
        >
          <input hidden readOnly name={"type"} value={"none"} />
          <input hidden name="mode" value={mode} readOnly />
          <Button
            className={"lg:text-2xl xl:text-3xl h-full"}
            onClick={handleOpenClick}
            type={"submit"}
          >
            Zum Board
          </Button>
        </selectFetcher.Form>

        <DialogContent className={"sm:max-w-[90%] sm:max-h-[80%]"}>
          <DialogHeader>
            <DialogTitle>Frage öffnen</DialogTitle>
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
                    className={`w-full overflow-hidden whitespace-break-spaces xl:text-3xl h-full flex items-center justify-center border-2 !border-primary`}
                  >
                    {cate}
                  </Button>
                  {Array.from(
                    { length: activeMatrix[0]?.length },
                    (_, rowIndex) => (
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
                          className={`flex-1 md:text-3xl xl:text-4xl w-full h-full flex items-center justify-center ${!activeMatrix[colIndex][rowIndex] && "opacity-40"}`}
                          type={"submit"}
                        >
                          {grid.get(`${colIndex}:${rowIndex}`)?.points ??
                            (rowIndex + 1) * 100}
                        </Button>
                      </selectFetcher.Form>
                    ),
                  )}
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
    </div>
  );
};

export default QuestionSelect;
