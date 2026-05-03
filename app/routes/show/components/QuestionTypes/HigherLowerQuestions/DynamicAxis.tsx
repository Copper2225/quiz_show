import React, { useEffect, useState } from "react";
import { HigherLowerTile } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/HigherLowerTile";
import type { HigherLowerOption } from "~/types/adminTypes";

interface Props {
  lowLabel?: string;
  highLabel?: string;
  max: number;
  items: HigherLowerOption[];
  forceSquare: boolean;
  forceReveal: boolean
}

export const DynamicAxis: React.FC<Props> = ({
  max,
  lowLabel = "low",
  highLabel = "high",
  items,
  forceSquare,
  forceReveal,
}) => {
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (screenWidth === null) return null;

  const points = Array.from({ length: max }, (_, i) => i + 1);

  const intervalWidthPercent = (1 / (max - 1)) * 100;

  const size = Math.max(32, Math.min(96, (screenWidth / max) * 0.5));
  const axisLabelSize = Math.max(8, Math.min(26, (screenWidth / max) * 0.3));
  const axisLabelTop = Math.max(24, Math.min(32, (screenWidth / max) * 0.4));

  return (
    <div className={`w-full pb-12 pt-4 px-4 font-sans`}>
      <div className="relative w-full">
        <div className="flex items-center">
          <div className="text-white text-xs font-bold uppercase mr-4 tracking-tighter shrink-0">
            {lowLabel}
          </div>

          <div className="relative flex-1 flex justify-between items-center h-10">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-white/80" />

            {points.map((num) => (
              <div
                key={num}
                className="relative flex flex-col items-center w-0 overflow-visible"
              >
                <span
                  className={`absolute font-black drop-shadow-[0_0_6px_rgba(130,0,219,0.8)] whitespace-nowrap text-purple-700`}
                  style={{
                    fontSize: `${axisLabelSize}px`,
                    top: `-${axisLabelTop}px`,
                  }}
                >
                  {num}
                </span>
                <div className="w-[2px] h-4 bg-white z-10" />
              </div>
            ))}
          </div>

          <div className="text-white text-xs font-bold uppercase ml-4 tracking-tighter shrink-0">
            {highLabel}
          </div>
        </div>

        <div className="relative">
          <div className="flex w-full items-start">
            <div className="invisible mr-4 shrink-0">
              <div className="text-xs font-bold uppercase tracking-tighter">
                {lowLabel}
              </div>
            </div>

            <div className={`relative flex-1`} style={{ height: `${size}px` }}>
              <div
                className="absolute inset-0 flex justify-center"
                style={{ gap: `${intervalWidthPercent}%` }}
              >
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="relative flex justify-center w-0 overflow-visible"
                  >
                    <div className="absolute top-5">
                      <HigherLowerTile
                        showText={item.showText || forceReveal}
                        imgSrc={item.imgSrc}
                        value={item.value}
                        forceSquare={forceSquare}
                        max={max}
                        inAxis={true}
                        label={item.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="invisible ml-4 shrink-0">
              <div className="text-xs font-bold uppercase tracking-tighter">
                {highLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
