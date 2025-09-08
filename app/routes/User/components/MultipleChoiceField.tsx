import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { FitGroup } from "./FitGroup";
import { useEffect } from "react";

interface Props {
  data: {
    options: string[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
  locked: boolean;
}

const MultipleChoiceField = ({ data, locked }: Props) => {
  const selectionFetcher = useFetcher();

  useEffect(() => {
    selectionFetcher.load("/api/answer");
  }, []);

  return (
    <FitGroup texts={data.options}>
      {(fontSize, getRef) => (
        <div
          className="h-full w-full grid gap-3 touch-manipulation"
          style={{
            gridTemplateRows: `repeat(${data.options.length}, minmax(0, 1fr))`,
          }}
        >
          {data.options.map((choice, index) => (
            <selectionFetcher.Form
              method="post"
              action="/api/answer"
              className="flex h-full overflow-hidden"
              key={index}
            >
              <Button
                type="submit"
                disabled={locked}
                className={`w-full h-full rounded-2xl outline-4 ${selectionFetcher.data?.answer === choice ? "outline-purple-700" : "outline-gray-200"} outline-solid -outline-offset-12 p-2 ${
                  data.trueOrFalse === "on" &&
                  (index % 2 === 0 ? "bg-green-600" : "bg-red-600")
                }`}
              >
                <input hidden name="answer" value={choice} readOnly />
                {data.showLetters === "on" && (
                  <div className="bg-purple-600 ms-4 px-5 self-center content-center text-3xl rounded-3xl aspect-square h-min">
                    {String.fromCharCode("A".charCodeAt(0) + index)}
                  </div>
                )}
                <div
                  ref={getRef(index)}
                  className={`w-full content-center px-5 whitespace-pre-wrap overflow-hidden ${
                    data.showLetters === "on" ? "text-start" : "text-center"
                  }`}
                  style={{ fontSize }}
                >
                  {choice}
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
