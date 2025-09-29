import React, { useRef } from "react";
import Pin from "~/routes/edit/components/Pin/Pin";
import type { PinData } from "~/types/adminTypes";

interface Props {
  correct: PinData;
  image: string;
  showCorrect: boolean;
  pins: PinData[];
}

const PinMap = ({ correct, image, showCorrect, pins }: Props) => {
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  return (
    <div className={"mt-4 flex flex-col gap-3 self-center"}>
      <div className={"relative inline-block max-w-full"}>
        <img
          ref={previewImgRef}
          src={image}
          alt="preview"
          className={"w-full h-auto block select-none"}
        />
        {showCorrect && (
          <Pin
            xPercent={correct.xPercent}
            yPercent={correct.yPercent}
            tilt={
              pins.filter(
                (p) =>
                  Math.abs(
                    (p.xPercent / 100) * Number(correct.imgW) -
                      (correct.xPercent / 100) * Number(correct.imgW),
                  ) <= 5 &&
                  Math.abs(
                    (p.yPercent / 100) * Number(correct.imgH) -
                      (correct.yPercent / 100) * Number(correct.imgH),
                  ) <= 5,
              ).length
            }
            large
          />
        )}
        {pins.map((pin) => (
          <Pin
            xPercent={pin.xPercent}
            yPercent={pin.yPercent}
            fill={pin.teamColor}
            tilt={pins
              .filter(
                (p) =>
                  Math.abs(
                    (p.xPercent / 100) * Number(correct.imgW) -
                      (pin.xPercent / 100) * Number(correct.imgW),
                  ) <= 5 &&
                  Math.abs(
                    (p.yPercent / 100) * Number(correct.imgH) -
                      (pin.yPercent / 100) * Number(correct.imgH),
                  ) <= 5,
              )
              .indexOf(pin)}
            large
          />
        ))}
      </div>
    </div>
  );
};

export default PinMap;
