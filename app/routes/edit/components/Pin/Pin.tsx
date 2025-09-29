import React from "react";

interface Props {
  yPercent: number;
  xPercent: number;
  large?: boolean;
  tilt?: number;
  fill?: string;
}

const Pin = ({ yPercent, xPercent, fill, tilt = 0, large = false }: Props) => {
  console.log(tilt);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className={`iconify iconify--gis`}
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        top: `calc(${yPercent}% - ${large ? 20 : 13}px)`,
        transform: `translate(calc(-50% + ${tilt * 5}px), calc(-50% + ${tilt * 1}px)) rotate(${tilt * 15}deg)`,
        fill: fill ? fill : "var(--color-red-500)",
        width: large ? 40 : 26,
        height: large ? 40 : 26,
        pointerEvents: "none",
      }}
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M 50 0 a 18.955 18.955 0 0 0 -18.955 18.957 A 18.955 18.955 0 0 0 47.5 37.747 V 90 A 1 0 0 0 0 50 100 a 0 0 0 0 0 2.5 -10 V 37.746 a 18.955 18.955 0 0 0 16.455 -18.789 A 18.955 18.955 0 0 0 50 0 z z" />
      </g>
    </svg>
  );
};

export default Pin;
