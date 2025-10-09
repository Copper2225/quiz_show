import React, { useRef } from "react";
import Pin from "~/routes/edit/components/Pin/Pin";
import type { PinData } from "~/types/adminTypes";
import type { ShowPin } from "~/routes/show/components/QuestionTypes/PinQuestion/PinQuestionShow";

interface Props {
  correct: PinData;
  image: string;
  showCorrect: boolean;
  pins: ShowPin[];
}

const PinMap = ({ correct, image, showCorrect, pins }: Props) => {
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  return (
    <div
      className={"mt-4 flex flex-col gap-3 self-center h-full justify-center"}
    >
      <div
        className={"relative inline-block max-w-full max-h-full self-center"}
      >
        <img
          ref={previewImgRef}
          src={image}
          alt="preview"
          className={"max-w-full max-h-full object-contain block select-none"}
        />
        {showCorrect && (
          <Pin
            xPercent={correct.xPercent}
            yPercent={correct.yPercent}
            tilt={0}
            large
          />
        )}
        {pins.map(
          (pin) =>
            pin.show && (
              <Pin
                xPercent={pin.xPercent}
                yPercent={pin.yPercent}
                fill={pin.teamColor}
                tilt={[
                  {
                    teamColor: "red",
                    xPercent: correct.xPercent,
                    yPercent: correct.yPercent,
                    show: true,
                  },
                  ...pins,
                ]
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
            ),
        )}
      </div>
    </div>
  );
};

export default PinMap;
