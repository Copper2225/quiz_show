import { type ReactElement, useCallback } from "react";
import { Button } from "~/components/ui/button";
import React from "react";
import { useNavigate } from "react-router";
import { FitGroup } from "~/routes/user/components/FitGroup";

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
  const navigate = useNavigate();
  const handleCategoryClick = useCallback(() => {
    navigate("/admin");
  }, []);
  return (
    <FitGroup texts={categories}>
      {(fontSize, getRef, getWrapperRef) => (
        <div
          className="grid gap-4 h-full flex-1 self-center overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${questions + 1}, minmax(0, 1fr))`,
            gridAutoFlow: "column dense",
          }}
        >
          {categories.map((_cate, colIndex) => {
            return (
              <React.Fragment key={colIndex}>
                <Button
                  onClick={handleCategoryClick}
                  variant={"outline"}
                  ref={getWrapperRef(colIndex)}
                  style={{ fontFamily: "Rampart One", fontSize: fontSize }}
                  className={`w-full overflow-hidden whitespace-break-spaces text-5xl h-full flex items-center justify-center border-2 !border-primary`}
                >
                  <div
                    style={{ opacity: 0, transition: "opacity 0.2s" }}
                    className={"px-1"}
                    ref={getRef(colIndex)}
                  >
                    {categories[colIndex]}
                  </div>
                </Button>
                {Array.from({ length: questions }, (_, rowIndex) => (
                  <Button
                    className={`w-full text-5xl h-full flex items-center justify-center ${!activeMatrix[colIndex][rowIndex] && "bg-teal-950 hover:bg-teal-950"}`}
                    type={"submit"}
                    key={rowIndex}
                  >
                    {(rowIndex + 1) * 100}
                  </Button>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </FitGroup>
  );
};

export default PointsGrid;
