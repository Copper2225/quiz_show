import React, { useLayoutEffect, useState } from "react";

interface Props {
  imgSrc?: string;
  value?: string;
  label: string;
  showText: boolean;
  forceSquare: boolean
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
        className={`border-2 flex-1 border-white ${forceSquare && "aspect-square"} content-center overflow-x-hidden text-center`}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
      >
        {imgSrc ? (
          <>
            <img
              className={"w-full h-full object-cover"}
              src={imgSrc}
              alt={"Bild"}
            />
            <span style={{top: inAxis ? -20 : -30, fontFamily: "monospace", margin: "0 -1000%" }} className={`absolute left-0 right-0 ${inAxis ? "text-xs" : "text-lg"} text-nowrap`}>{label}</span>
          </>
        ) : (
          <div
            className={
              "text-center overflow-hidden overflow-ellipsis text-nowrap"
            }
            style={{
              fontSize: `${textSize}px`,
            }}
          >
            {label}
          </div>
        )}
      </div>
      {showText && (
        <span
          className={`text-white mt-1 absolute whitespace-nowrap`}
          style={{
            fontSize: `${textSize}px`,
            bottom: `-${bottomOffset}px`,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};
