import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

interface Props {
  name: string;
  defaultValue?: number[];
  className?: string;
  disabled?: boolean;
}

const StepSlider: React.FC<Props> = ({
  name,
  className,
  disabled,
  defaultValue,
}) => {
  const [value, setValue] = React.useState<number[]>([0]);
  const steps = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={`min-w-full max-w-md py-10 ${className}`}>
      <div className="relative w-full">
        <div className="flex justify-between w-full px-[10px] mb-2">
          {steps.map((step) => (
            <span
              key={step}
              className={cn(
                "text-sm font-bold transition-all duration-200 -translate-x-1/2 w-0 flex justify-center",
                value[0] === step
                  ? (disabled ? "text-teal-800" : "text-teal-500") +
                      " scale-125"
                  : "text-gray-500",
              )}
            >
              {step}
            </span>
          ))}
        </div>

        <SliderPrimitive.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={value}
          onValueChange={setValue}
          name={name}
          defaultValue={defaultValue}
          max={10}
          min={1}
          step={1}
          disabled={disabled}
        >
          <SliderPrimitive.Track className="bg-gray-800 relative grow rounded-full h-1.5">
            <SliderPrimitive.Range
              className={`absolute ${disabled ? "bg-teal-900" : "bg-teal-600"} rounded-full h-full`}
            />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb
            className={`block w-5 h-5 bg-black border-2 ${disabled ? "border-teal-900" : "border-teal-500"} rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.1)] focus:outline-none transition-transform active:scale-90`}
          />
        </SliderPrimitive.Root>
      </div>
    </div>
  );
};

export default StepSlider;
