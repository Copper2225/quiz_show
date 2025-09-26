import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "~/components/ui/button";
import type { MediaConfig } from "~/types/adminTypes";

interface Props {
  data: {
    options: string[];
    shuffledOptions: string[];
    media?: MediaConfig;
  };
  showCorrect: boolean;
}

const OrderBaseShow = ({ data, showCorrect }: Props) => {
  const [fontSize, setFontSize] = useState("3rem");
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const options = useMemo(() => {
    if (showCorrect) {
      return data.options;
    } else {
      return data.shuffledOptions;
    }
  }, [showCorrect]);

  useEffect(() => {
    let smallestScale = 1;

    optionRefs.current = optionRefs.current.slice(0, options.length);

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
  }, [options]);

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
        {options.map((choice, index) => (
          <Button
            key={index}
            className={`flex w-full flex-1 text-5xl rounded-2xl p-3 outline-4 outline-solid -outline-offset-12 outline-gray-200`}
          >
            <div
              style={{ fontSize }}
              className={`${showCorrect ? "bg-emerald-400" : "bg-purple-600"} ms-4 px-5 self-center content-center text-3xl rounded-3xl aspect-square h-[1.5em]`}
            >
              {showCorrect
                ? data.shuffledOptions.indexOf(options[index]) + 1
                : index + 1}
            </div>
            <div
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              style={{ fontSize }}
              className={`w-full content-center px-5 whitespace-break-spaces overflow-hidden h-full`}
            >
              {choice}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OrderBaseShow;
