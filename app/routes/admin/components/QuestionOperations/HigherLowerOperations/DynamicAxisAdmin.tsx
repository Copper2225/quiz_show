import React from "react";
import type { HigherLowerOption } from "~/types/adminTypes";
import { HigherLowerTileAdmin } from "~/routes/admin/components/QuestionOperations/HigherLowerOperations/HigherLowerTileAdmin";

interface Props {
  lowLabel?: string;
  highLabel?: string;
  items: HigherLowerOption[];
  className?: string;
}

export const DynamicAxisAdmin: React.FC<Props> = ({
  lowLabel = "low",
  highLabel = "high",
  items,
}) => {
  const points = Array.from({ length: items.length }, (_, i) => i + 1);

  const intervalWidthPercent = (1 / (items.length - 1)) * 100;

  const size = Math.max(32, Math.min(96, (1 / items.length) * 1000));
  const axisLabelSize = Math.max(8, Math.min(14, (1 / items.length) * 180));
  const axisLabelTop = Math.max(24, Math.min(32, (1 / items.length) * 400));

  return (
    <div className={`w-full bg-black py-12 px-12 font-sans`}>
      <div className={"relative w-full"}>
        <div className={"flex items-center"}>
          <span
            className={
              "text-white text-xs font-bold uppercase mr-4 tracking-tighter shrink-0"
            }
          >
            {lowLabel}
          </span>

          <div
            className={"relative flex-1 flex justify-between items-center h-10"}
          >
            <div
              className={
                "absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-white/80"
              }
            />

            {points.map((num) => (
              <div
                key={num}
                className={
                  "relative flex flex-col items-center w-0 overflow-visible"
                }
              >
                <span
                  className={`absolute font-black drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] whitespace-nowrap`}
                  style={{
                    fontSize: `${axisLabelSize}px`,
                    top: `-${axisLabelTop}px`,
                  }}
                >
                  {num}
                </span>
                <div className={"w-[2px] h-4 bg-white z-10"} />
              </div>
            ))}
          </div>

          <span
            className={
              "text-white text-xs font-bold uppercase ml-4 tracking-tighter shrink-0"
            }
          >
            {highLabel}
          </span>
        </div>

        <div className={"relative"}>
          <div className={"flex w-full items-start"}>
            <div className={"invisible mr-4 shrink-0"}>
              <span className={"text-xs font-bold uppercase tracking-tighter"}>
                {lowLabel}
              </span>
            </div>

            <div className={`relative flex-1`} style={{ height: `${size}px` }}>
              <div
                className={"absolute inset-0 flex justify-center"}
                style={{ gap: `${intervalWidthPercent}%` }}
              >
                {items.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="relative flex justify-center w-0 overflow-visible"
                    >
                      <div className="absolute top-0">
                        <HigherLowerTileAdmin
                          imgSrc={item.imgSrc}
                          value={item.value}
                          label={item.label}
                          isRevealed={item.show || item.showText}
                          max={items.length}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={"invisible ml-4 shrink-0"}>
              <span className={"text-xs font-bold uppercase tracking-tighter"}>
                {highLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
