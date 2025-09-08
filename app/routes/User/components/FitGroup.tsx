import { useLayoutEffect, useRef, useState } from "react";

interface FitGroupProps {
  texts: string[];
  children: (
    fontSize: number,
    getRef: (index: number) => (el: HTMLDivElement | null) => void,
  ) => React.ReactNode;
  minFontSize?: number;
  maxFontSize?: number;
}

const FitGroup = ({
  texts,
  children,
  minFontSize = 10,
  maxFontSize = 200,
}: FitGroupProps) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const getRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  useLayoutEffect(() => {
    if (!refs.current.length) return;

    let bestSize = maxFontSize;

    refs.current.forEach((el) => {
      if (!el) return;

      let low = minFontSize;
      let high = maxFontSize;
      let best = minFontSize;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        el.style.fontSize = `${mid}px`;

        const fitsWidth = el.scrollWidth <= el.clientWidth;
        const fitsHeight = el.scrollHeight <= el.clientHeight;

        if (fitsWidth && fitsHeight) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      bestSize = Math.min(bestSize, best);
    });

    setFontSize(bestSize * 0.95);
  }, [texts, minFontSize, maxFontSize]);

  return <>{children(fontSize, getRef)}</>;
};

export { FitGroup };
