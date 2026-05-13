import { type FC, useEffect, useMemo, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";

const strokeWidth = 30;
const sqSize = 400;

const Timer: FC = () => {
  const timerSource = useEventSource("/tools/sse/timer", { event: "timeSet" });
  const [percentage, setPercentage] = useState(100);
  const [timer, setTimer] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (timerSource) {
      setTimer(Number(timerSource));
      setPercentage(100);
      setShow(timerSource !== "0");
    }
  }, [timerSource]);

  useEffect(() => {
    if (percentage <= 0) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const intervalTime = 50; // 20 fps
    const interval = setInterval(() => {
      setPercentage((prev) =>
        Math.max(prev - 100 / (timer * (1000 / intervalTime)), 0),
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [percentage, timer]);

  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  const remainingTime = Math.ceil((percentage * timer) / 100);

  const formattedTime = useMemo(() => {
    if (timer > 60) {
      return `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, "0")}`;
    } else {
      return `${remainingTime}`;
    }

  }, [remainingTime, timer]);

  return (
    <div
      className={`${show ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    >
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className="fill-none stroke-[#ECECEC]"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className={"fill-none stroke-secondary"}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeLinecap="round"
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fill="#FFFFFF"
          className="text-8xl font-semibold"
        >
          {formattedTime}
        </text>
      </svg>
    </div>
  );
};

export default Timer;
