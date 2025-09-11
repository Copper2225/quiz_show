import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState, Fragment } from "react";
import type { QuestionEntity } from "@prisma/client";

interface Props {
  categories: string[];
  activeMatrix: boolean[][];
  grid: Map<string, QuestionEntity>;
}

const QuestionSelect = ({ categories, activeMatrix, grid }: Props) => {
  const [open, setOpen] = useState(false);
  const selectFetcher = useFetcher();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>OPEN</Button>
      </DialogTrigger>
      <selectFetcher.Form
        method={"post"}
        action={"/api/question"}
        className={"flex flex-col"}
      >
        <input hidden readOnly name={"type"} value={"none"} />
        <Button type={"submit"}>Clear Question</Button>
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
                    onSubmit={() => setOpen(false)}
                  >
                    <input
                      hidden
                      name="event"
                      value="selectQuestion"
                      readOnly
                    />
                    <input
                      readOnly
                      hidden
                      name="data"
                      value={JSON.stringify({ col: colIndex, row: rowIndex })}
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
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSelect;
