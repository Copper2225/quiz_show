import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface FitGroupProps {
  texts: string[];
  children: (
    fontSize: number,
    getRef: (index: number) => (el: HTMLDivElement | null) => void,
    getWrapperRef: (
      index: number,
    ) => (el: HTMLDivElement | HTMLButtonElement | null) => void,
  ) => React.ReactNode;
  minFontSize?: number;
  maxFontSize?: number;
}

const FitGroup = ({
  texts,
  children,
  minFontSize = 10,
  maxFontSize = 50,
}: FitGroupProps) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRefs = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [measureKey, setMeasureKey] = useState(0);

  const getRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  const getWrapperRef =
    (index: number) => (el: HTMLDivElement | HTMLButtonElement | null) => {
      wrapperRefs.current[index] = el;
    };

  useLayoutEffect(() => {
    let isCancelled = false;

    const measure = async () => {
      if (!refs.current.length) return;

      // Wait for web fonts to be ready (when supported)
      try {
        const docFonts: any = (document as any).fonts;
        if (docFonts && typeof docFonts.ready?.then === "function") {
          await docFonts.ready;
        }
      } catch {}

      // Wait a frame for layout to settle
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );

      let bestSize = maxFontSize;

      refs.current.forEach((el, index) => {
        if (!el || !wrapperRefs.current[index]) return;

        const previousInlineFontSize = el.style.fontSize;

        let low = minFontSize;
        let high = maxFontSize;
        let best = minFontSize;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);

          // Hide text during measurement
          el.style.opacity = "1";
          el.style.fontSize = `${mid}px`;

          const fitsWidth =
            el.scrollWidth <= wrapperRefs.current[index]!.clientWidth;
          const fitsHeight =
            el.scrollHeight <= wrapperRefs.current[index]!.clientHeight;

          if (fitsWidth && fitsHeight) {
            best = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        // Restore previous inline style
        el.style.fontSize = previousInlineFontSize;
        el.style.visibility = "";

        // Restore previous inline style to avoid residue from measurement
        el.style.fontSize = previousInlineFontSize;

        bestSize = Math.min(bestSize, best);
      });

      if (!isCancelled) {
        setFontSize(bestSize * 0.99);
      }
    };

    void measure();

    return () => {
      isCancelled = true;
    };
  }, [texts, minFontSize, maxFontSize, measureKey]);

  useEffect(() => {
    const handleResize = () => setMeasureKey((v) => v + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <>{children(fontSize, getRef, getWrapperRef)}</>;
};

export { FitGroup };
