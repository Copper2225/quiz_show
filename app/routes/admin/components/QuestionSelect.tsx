import { Button } from "~/components/ui/button";
import { Form, useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";

interface Props {
  categories: string[];
  questions: number;
  activeMatrix: boolean[][];
}

const QuestionSelect = ({ categories, questions, activeMatrix }: Props) => {
  const [open, setOpen] = useState(false);
  const selectFetcher = useFetcher();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>OPEN</Button>
      </DialogTrigger>
      <selectFetcher.Form method={"post"} action={"/api/question"}>
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
            gridTemplateRows: `repeat(${questions + 1}, minmax(0, 1fr))`,
            gridAutoFlow: "column dense",
          }}
        >
          {categories.map((_cate, colIndex) => {
            return (
              <>
                <Button
                  variant={"outline"}
                  className={`w-full overflow-hidden whitespace-break-spaces text-3xl h-full flex items-center justify-center border-2 !border-primary`}
                >
                  {categories[colIndex]}
                </Button>
                {Array.from({ length: questions }, (_, rowIndex) => (
                  <selectFetcher.Form
                    method={"post"}
                    action={"/api/question"}
                    onSubmit={() => setOpen(false)}
                  >
                    <input hidden name="event" value="selectQuestion" />
                    <input
                      hidden
                      name="data"
                      value={JSON.stringify({ col: colIndex, row: rowIndex })}
                    />
                    <Button
                      className={`w-full text-4xl h-full flex items-center justify-center ${!activeMatrix[colIndex][rowIndex] && "bg-teal-950 hover:bg-teal-950"}`}
                      type={"submit"}
                    >
                      {(rowIndex + 1) * 100}
                    </Button>
                  </selectFetcher.Form>
                ))}
              </>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSelect;
