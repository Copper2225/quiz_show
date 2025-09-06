import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";

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
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [fontSize, setFontSize] = useState("3rem");

  useEffect(() => {
    let smallestScale = 1;

    optionRefs.current = optionRefs.current.slice(0, data.options.length);

    optionRefs.current.forEach((div) => {
      if (div) {
        const { clientHeight, scrollHeight } = div;
        if (scrollHeight > clientHeight) {
          const currentScale = clientHeight / scrollHeight;
          if (currentScale < smallestScale) {
            smallestScale = currentScale;
          }
        }
      }
    });

    if (smallestScale < 1) {
      setFontSize(`${smallestScale * 3}rem`);
    } else {
      setFontSize("4rem");
    }
  }, [data.options]);

  return (
    <div className={"h-full w-full flex flex-col gap-3"}>
      {data.options.map((choice, index) => (
        <selectionFetcher.Form
          method={"post"}
          action={"/api/answer"}
          className={"flex-1 flex"}
          key={index}
        >
          <Button
            type={"submit"}
            ref={(el) => {
              optionRefs.current[index] = el;
            }}
            disabled={locked}
            style={{ fontSize }}
            className={`flex-1 h-full rounded-2xl p-2 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
          >
            <input hidden name={"answer"} value={choice} readOnly />
            <div
              className={`flex w-full h-full text-3xl rounded-2xl p-3 border-4 !border-gray-200 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
            >
              {data.showLetters === "on" && (
                <div
                  className={
                    "bg-purple-600 px-5 self-center content-center rounded-3xl aspect-square h-min"
                  }
                >
                  {String.fromCharCode("A".charCodeAt(0) + index)}
                </div>
              )}
              <div
                className={`w-full content-center px-5 whitespace-break-spaces overflow-hidden ${data.showLetters === "on" ? "text-start" : "text-center"}`}
              >
                {choice}
              </div>
            </div>
          </Button>
        </selectionFetcher.Form>
      ))}
    </div>
  );
};

export default MultipleChoiceField;
