import { cn } from "~/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import React, { useMemo } from "react";
import type { WavelengthQuestion } from "~/types/adminTypes";
import ShowText from "~/routes/show/components/ShowText";

interface Props {
  question: WavelengthQuestion;
  withHeader: boolean;
  show: boolean;
}

const WavelengthShow: React.FC<Props> = ({ question, show, withHeader }) => {
  const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (!question.config.useNumber)
    return (
      <div className={"flex flex-1 p-4 gap-4 overflow-hidden"}>
        {question.config?.media?.mediaChecked && (
          <div
            className={`${show ? "min-w-3/5" : "w-full"} content-center h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12`}
          >
            <img
              style={{
                objectFit: question.config.media?.objectFit ?? "contain",
              }}
              className={`h-full w-full justify-self-center`}
              src={question.config?.media?.mediaFile}
              alt={"Media"}
            />
          </div>
        )}
        {!withHeader && !show && <ShowText>{question.prompt}</ShowText>}
        {show && (
          <ShowText textColor={"var(--color-emerald-500)"}>
            {question.config.answer}
          </ShowText>
        )}
      </div>
    );

  const numberAnswer = useMemo(() => {
    return Array.isArray(question.config.numberAnswer)
      ? question.config.numberAnswer
      : [question.config.numberAnswer ?? 1];
  }, [question.config.numberAnswer]);

  return (
    <div className={`min-w-full max-w-md px-10 content-center h-full`}>
      <div className="relative w-full">
        <div className="flex justify-between w-full px-[20px] mb-2">
          {steps.map((step) => (
            <span
              key={step}
              className={cn(
                "text-4xl font-bold transition-all duration-200 -translate-x-1/2 w-0 flex justify-center",
                numberAnswer[0] === step && show
                  ? "text-teal-800" + " scale-125"
                  : "text-gray-500",
              )}
            >
              {step}
            </span>
          ))}
        </div>

        <SliderPrimitive.Root
          className="relative flex items-center select-none touch-none w-full h-10"
          value={numberAnswer}
          max={10}
          min={1}
          step={1}
        >
          <SliderPrimitive.Track className="bg-gray-600 relative grow rounded-full h-1.5">
            <SliderPrimitive.Range
              className={`absolute bg-teal-900" rounded-full h-full`}
            />
          </SliderPrimitive.Track>

          {show && (
            <SliderPrimitive.Thumb
              className={`block w-10 h-10 bg-gray-800 border-2 border-teal-500 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.1)] focus:outline-none transition-transform active:scale-90`}
            />
          )}
        </SliderPrimitive.Root>
      </div>
      <div className={"flex justify-between text-4xl mt-8"}>
        <div>{question.config.lowLabel}</div>
        <div>{question.config.highLabel}</div>
      </div>
    </div>
  );
};
export default WavelengthShow;
