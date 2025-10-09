import React from "react";

interface Props {
  yPercent: number;
  xPercent: number;
  large?: boolean;
  tilt?: number;
  fill?: string;
}

const Pin = ({ yPercent, xPercent, fill, tilt = 0, large = false }: Props) => {
  return (
    <svg
      viewBox="0 0 38 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className={`iconify iconify--gis`}
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        top: `calc(${yPercent}% - ${large ? 20 : 13}px)`,
        transform: `translate(-50%, -50%) rotate(${tilt * 12}deg)`,
        transformOrigin: "bottom center",
        fill: fill ? fill : "var(--color-red-500)",
        width: large ? 40 : 26,
        height: large ? 40 : 26,
        pointerEvents: "none",
      }}
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M 19 0 a 18.955 18.955 0 0 0 -18.955 18.957 A 18.955 18.955 0 0 0 16.5 37.747 V 90 A 1 0 0 0 0 19 100 a 0 0 0 0 0 2.5 -10 V 37.746 a 18.955 18.955 0 0 0 16.455 -18.789 A 18.955 18.955 0 0 0 19 0 z z" />
      </g>
    </svg>
  );
};

export default Pin;
