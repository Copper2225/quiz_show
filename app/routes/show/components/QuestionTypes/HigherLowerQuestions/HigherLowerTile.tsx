import React from "react";

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
  const size = inAxis ? Math.max(32, Math.min(96, (1 / max) * 1300)) : 96;
  const textSize = inAxis ? Math.max(10, Math.min(16, (1 / max) * 200)) : 16;
  const bottomOffset = inAxis
    ? Math.max(16, Math.min(25, (1 / max) * 300))
    : 25;

  return (
    <div
      className={`text-center items-center flex flex-col`}
      style={{ height: `${size}px` }}
    >
      <div
        className={`border-2 flex-1 border-white aspect-square content-center text-center`}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
      >
        {imgSrc ? (
          <img
            className={"w-full h-full object-cover"}
            src={imgSrc}
            alt={"Bild"}
          />
        ) : (
          <span className={"text-center"}>{text}</span>
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
