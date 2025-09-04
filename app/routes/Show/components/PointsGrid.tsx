import type { ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { Form } from "react-router";

interface Props {
  categories: string[];
  questions: number;
  activeMatrix: boolean[][];
}

const PointsGrid = ({
  categories,
  questions,
  activeMatrix,
}: Props): ReactElement => {
  return (
    <div
      className="grid gap-4 h-full flex-1"
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
              className={`w-full overflow-hidden whitespace-break-spaces text-4xl h-full flex items-center justify-center border-2 !border-primary`}
            >
              {categories[colIndex]}
            </Button>
            {Array.from({ length: questions }, (_, rowIndex) => (
              <Form method={"post"}>
                <input
                  hidden
                  name={"data"}
                  value={JSON.stringify({ row: rowIndex, col: colIndex })}
                  readOnly
                />
                <Button
                  className={`w-full text-5xl h-full flex items-center justify-center ${activeMatrix[colIndex][rowIndex] && "bg-teal-950 hover:bg-teal-950"}`}
                  type={"submit"}
                >
                  {(rowIndex + 1) * 100}
                </Button>
              </Form>
            ))}
          </>
        );
      })}
    </div>
  );
};

export default PointsGrid;
