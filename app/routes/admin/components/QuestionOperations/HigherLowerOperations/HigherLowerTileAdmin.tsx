import React, { useCallback } from "react";
import { useFetcher } from "react-router";

interface Props {
  imgSrc?: string;
  text: string;
  isRevealed?: boolean;
  max: number;
}

export const HigherLowerTileAdmin: React.FC<Props> = ({
  imgSrc,
  text,
  isRevealed = false,
  max,
}) => {
  const fetcher = useFetcher();

  const size = Math.max(32, Math.min(96, (1 / max) * 1000));
  const textSize = Math.max(10, Math.min(16, (1 / max) * 200));
  const bottomOffset = Math.max(16, Math.min(25, (1 / max) * 300));

  const revealTile = useCallback(() => {
    const formData = new FormData();
    formData.append("text", text);
    fetcher.submit(formData, {
      method: "post",
      action: "/api/higherLower/reveal",
    });
  }, [fetcher, text]);

  return (
    <div
      className={`text-center items-center flex flex-col cursor-pointer`}
      style={{ height: `${size}px` }}
      onClick={revealTile}
    >
      <div
        className={`border-6 flex-1 ${isRevealed ? "border-green-600" : "border-gray-400"} aspect-square content-center text-center`}
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
      <span
        className={`text-white mt-1 absolute whitespace-nowrap`}
        style={{
          fontSize: `${textSize}px`,
          bottom: `-${bottomOffset}px`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
