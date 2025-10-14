import { useFetcher } from "react-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Pin from "~/routes/edit/components/Pin/Pin";
import type { PinData } from "~/types/adminTypes";
import { Button } from "~/components/ui/button";
import type { UserPinQuestion } from "~/types/userTypes";

interface Props {
  data: UserPinQuestion;
  locked: boolean;
  answer: string | undefined;
  teamColor: string;
  isPreview?: boolean;
}

const PinField = ({
  data,
  locked,
  answer,
  teamColor,
  isPreview = false,
}: Props) => {
  const submitFetcher = useFetcher();
  const answerPin = useMemo(() => {
    if (answer !== undefined) {
      return JSON.parse(answer) as PinData;
    } else {
      return null;
    }
  }, []);

  const [isDirty, setDirty] = useState(false);

  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setNaturalSize({
        w: e.currentTarget.naturalWidth,
        h: e.currentTarget.naturalHeight,
      });
    },
    [naturalSize],
  );

  const [xPercent, setXPercent] = useState<number | "">(
    answerPin?.xPercent ?? "",
  );
  const [yPercent, setYPercent] = useState<number | "">(
    answerPin?.yPercent ?? "",
  );
  const fullImgRef = useRef<HTMLImageElement | null>(null);

  const submit = useCallback(() => {
    const formData = new FormData();
    formData.append(
      "answer",
      JSON.stringify({
        xPercent,
        yPercent,
        teamColor,
      }),
    );

    submitFetcher.submit(formData, {
      method: "post",
      action: "/api/answer",
    });
    setDirty(false);
  }, [xPercent, yPercent, teamColor]);

  useEffect(() => {
    const img = fullImgRef.current;
    if (img && img.complete && naturalSize === null) {
      setNaturalSize({
        w: img.naturalWidth,
        h: img.naturalHeight,
      });
    }
  }, [fullImgRef, naturalSize]);

  const handleDialogClick = useCallback(
    (e: React.MouseEvent) => {
      if (!fullImgRef.current || !naturalSize || locked) return;
      const rect = fullImgRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const clampedX = Math.max(0, Math.min(clickX, rect.width));
      const clampedY = Math.max(0, Math.min(clickY, rect.height));
      const scaleX = naturalSize.w / rect.width;
      const scaleY = naturalSize.h / rect.height;
      const pxX = Math.round(clampedX * scaleX);
      const pxY = Math.round(clampedY * scaleY);
      const pctX = Math.round((pxX / naturalSize.w) * 10000) / 100;
      const pctY = Math.round((pxY / naturalSize.h) * 10000) / 100;
      setXPercent(pctX);
      setYPercent(pctY);
      setDirty(true);
    },
    [naturalSize, fullImgRef, locked],
  );

  return (
    <div className={"h-full flex flex-col justify-between"}>
      <div className={"p-2 md:p-4 flex items-center flex-col justify-center"}>
        <div className={"relative inline-block"}>
          <img
            ref={fullImgRef}
            src={data.config.image}
            alt="full"
            className={
              "max-w-[95vw] max-h-[85vh] w-auto h-auto block cursor-crosshair select-none object-contain"
            }
            onClick={handleDialogClick}
            onLoad={onImageLoad}
            draggable={false}
          />
          {xPercent !== "" && yPercent !== "" && (
            <Pin xPercent={xPercent} yPercent={yPercent} fill={teamColor} />
          )}
        </div>
      </div>
      <Button
        onClick={submit}
        disabled={locked || !isDirty || isPreview}
        className={
          "self-bottom w-full h-[100px] text-5xl bg-purple-700 hover:bg-purple-900"
        }
      >
        Absenden
      </Button>
    </div>
  );
};

export default PinField;
