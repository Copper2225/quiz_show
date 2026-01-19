import React, { useEffect, useState } from "react";

interface Props {
  imgSrc?: string;
  text?: string;
  showText: boolean;
  max: number;
  inAxis?: boolean;
}

export const HigherLowerTile: React.FC<Props> = ({
  imgSrc,
  text,
  showText,
  max,
  inAxis = false,
}) => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const size = inAxis
    ? Math.max(32, Math.min(120, (screenWidth / max) * 0.87))
    : screenWidth * 0.09;
  const textSize = inAxis
    ? Math.max(10, Math.min(16, (screenWidth / max) * 0.1))
    : screenWidth * 0.015;
  const bottomOffset = inAxis
    ? Math.max(16, Math.min(25, (screenWidth / max) * 0.15))
    : 25;

  return (
    <div
      className={`text-center items-center flex flex-col`}
      style={{ height: `${size}px` }}
    >
      <div
        className={`border-2 flex-1 border-white aspect-square content-center overflow-x-hidden text-center`}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
      >
        {imgSrc ? (
          <img
            className={"w-full h-full object-cover"}
            src={imgSrc}
            alt={"Bild"}
          />
        ) : (
          <div
            className={
              "text-center overflow-hidden overflow-ellipsis text-nowrap"
            }
            style={{
              fontSize: `${textSize}px`,
            }}
          >
            {text}
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
          {text}
        </span>
      )}
    </div>
  );
};
