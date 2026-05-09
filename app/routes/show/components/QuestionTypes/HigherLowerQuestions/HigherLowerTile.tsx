import React, { useLayoutEffect, useState } from "react";

interface Props {
  imgSrc?: string;
  value?: string;
  label: string;
  showText: boolean;
  forceSquare: boolean;
  max: number;
  inAxis?: boolean;
}

export const HigherLowerTile: React.FC<Props> = ({
  imgSrc,
  value,
  label,
  showText,
  forceSquare,
  max,
  inAxis = false,
}) => {
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (screenWidth === null) return null;

  const size = inAxis
    ? Math.max(32, Math.min(120, (screenWidth / max) * 0.87))
    : screenWidth * 0.07;
  const textSize = inAxis
    ? Math.max(10, Math.min(16, (screenWidth / max) * 0.1))
    : screenWidth * 0.015;
  const bottomOffset = inAxis
    ? Math.max(16, Math.min(25, (screenWidth / max) * 0.15))
    : 25;

  return (
    <div
      className={`text-center items-center flex flex-col relative`}
      style={{ height: `${size}px` }}
    >
      <div
        className={`border-2 flex-1 border-white ${forceSquare && "aspect-square"} content-center overflow-visible text-center`}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
      >
        {imgSrc ? (
          <>
            <img
              className={"w-full h-full object-cover"}
              src={imgSrc}
              alt={"Bild"}
            />
            <span
              style={{
                bottom: -54,
                fontFamily: "monospace",
                left: inAxis ? "0" : "-50%",
                right: inAxis ? "0" : "-50%",
              }}
              className={`absolute ${inAxis ? "text-xs" : "text-sm"} leading-tight flex items-start justify-center text-center h-12`}
            >
              {label}
            </span>
          </>
        ) : (
          <div
            className={"text-center overflow-visible relative"}
            style={{
              fontSize: `${textSize}px`,
              lineHeight: "1.2",
              height: "100%",
            }}
          >
            <span
              className={`absolute ${inAxis ? "left-0 right-0" : "left-[-50%] right-[-50%]"} -top-24 bottom-0 flex items-end justify-center text-center px-1 h-24`}
            >
              {label}
            </span>
          </div>
        )}
      </div>
      {showText && (
        <span
          className={`absolute items-end text-xs left-0 right-0 -top-12 bottom-0 flex justify-center text-center px-1 h-12`}
        >
          {value}
        </span>
      )}
    </div>
  );
};
