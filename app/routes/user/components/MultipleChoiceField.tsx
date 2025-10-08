import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { FitGroup } from "./FitGroup";
import { useEffect } from "react";
import type { UserMultipleChoiceQuestion } from "~/types/userTypes";

interface Props {
  data: UserMultipleChoiceQuestion;
  locked: boolean;
}

const MultipleChoiceField = ({ data, locked }: Props) => {
  const selectionFetcher = useFetcher();

  useEffect(() => {
    selectionFetcher.load("/api/answer");
  }, []);

  return (
    <FitGroup texts={data.config.options}>
      {(fontSize, getRef, getWrapperRef) => (
        <div
          className="h-full w-full grid gap-3 touch-manipulation"
          style={{
            gridTemplateRows: `repeat(${data.config.options.length}, minmax(0, 1fr))`,
          }}
        >
          {data.config.options.map((option, index) => (
            <selectionFetcher.Form
              method="post"
              action="/api/answer"
              className="flex h-full overflow-hidden"
              key={index}
            >
              <Button
                type="submit"
                disabled={locked}
                ref={getWrapperRef(index)}
                className={`w-full h-full rounded-2xl outline-4 ${selectionFetcher.data?.answer === option ? "outline-purple-700" : "outline-gray-200"} outline-solid -outline-offset-12 p-2 ${
                  data.config.trueOrFalse === "on" &&
                  (index % 2 === 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700")
                }`}
              >
                <input hidden name="answer" value={option} readOnly />
                <div
                  ref={getRef(index)}
                  style={{ fontSize }}
                  className={`flex-1 ps-4 pe-6 whitespace-pre-wrap overflow-hidden flex justify-start`}
                >
                  {data.config.showLetters === "on" && (
                    <div
                      style={{ lineHeight: 1 }}
                      className={`bg-gray-700 px-5 me-3 self-center content-center rounded-3xl aspect-square`}
                    >
                      {String.fromCharCode("A".charCodeAt(0) + index)}
                    </div>
                  )}
                  {option}
                </div>
              </Button>
            </selectionFetcher.Form>
          ))}
        </div>
      )}
    </FitGroup>
  );
};

export default MultipleChoiceField;
