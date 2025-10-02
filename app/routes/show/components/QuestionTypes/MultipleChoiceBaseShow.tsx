import React, { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import type { MediaConfig } from "~/types/adminTypes";

interface Props {
  data: {
    options: {
      name: string;
      checked?: "on" | "off";
    }[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
    media?: MediaConfig;
  };
  showCorrect: boolean;
}

const MultipleChoiceBaseShow = ({ data, showCorrect }: Props) => {
  const [fontSize, setFontSize] = useState("3rem");
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    <div className={"flex flex-1 p-4 gap-4 overflow-hidden"}>
      {data.media?.mediaChecked && (
        <div
          className={
            "w-3/5 content-center bg-primary h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12"
          }
        >
          <img
            className={"h-full justify-self-center"}
            src={data.media.mediaFile}
            alt={"Media"}
          />
        </div>
      )}
      <div className={"w-full flex flex-1 flex-col gap-4"}>
        {data.options.map((choice, index) => (
          <Button
            key={index}
            disabled={choice.checked !== "on" && showCorrect}
            className={`flex w-full flex-1 text-5xl rounded-2xl p-3 outline-4 outline-solid -outline-offset-12 outline-gray-200 ${data.trueOrFalse === "on" && (index % 2 === 0 ? "bg-green-600" : "bg-red-600")}`}
          >
            {data.showLetters === "on" && (
              <div
                className={
                  "bg-gray-700 px-5 ms-4 self-center content-center rounded-3xl aspect-square h-min"
                }
              >
                {String.fromCharCode("A".charCodeAt(0) + index)}
              </div>
            )}
            <div
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              style={{ fontSize }}
              className={`w-full content-center px-5 whitespace-break-spaces overflow-hidden h-full ${data.showLetters === "on" ? "text-start" : "text-center"}`}
            >
              {choice.name}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceBaseShow;
