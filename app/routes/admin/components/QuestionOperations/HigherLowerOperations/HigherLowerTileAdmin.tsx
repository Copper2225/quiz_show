import React, { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";

interface Props {
  imgSrc?: string;
  value: string;
  label: string;
  isRevealed?: boolean;
  max: number;
}

export const HigherLowerTileAdmin: React.FC<Props> = ({
  imgSrc,
  value,
  label,
  isRevealed = false,
  max,
}) => {
  const fetcher = useFetcher();

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const size = Math.max(32, Math.min(96, (screenWidth / max) * 0.75));
  const textSize = Math.max(10, Math.min(16, (screenWidth / max) * 0.1));
  const bottomOffset = Math.max(16, Math.min(25, (screenWidth / max) * 0.15));

  const revealTile = useCallback(() => {
    const formData = new FormData();
    formData.append("value", value);
    fetcher.submit(formData, {
      method: "post",
      action: "/api/higherLower/reveal",
    });
  }, [fetcher, value]);

  return (
    <div
      className={`text-center items-center flex flex-col cursor-pointer`}
      style={{ height: `${size}px` }}
      onClick={revealTile}
    >
      <div
        className={`border-4 flex-1 ${isRevealed ? "border-green-600" : "border-gray-400"} aspect-square overflow-x-hidden content-center text-center`}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
      >
        {imgSrc ? (
          <img
            className={"w-full h-full object-cover"}
            src={"https://quizshow.copperdev.de" + imgSrc}
            alt={"Bild"}
          />
        ) : (
          <div
            className={
              "text-center text-sm overflow-hidden overflow-ellipsis text-nowrap"
            }
          >
            {label}
          </div>
        )}
      </div>
      <span
        className={`text-white mt-1 absolute whitespace-nowrap`}
        style={{
          fontSize: `${textSize}px`,
          bottom: `-${bottomOffset}px`,
        }}
      >
        {value}
      </span>
    </div>
  );
};
