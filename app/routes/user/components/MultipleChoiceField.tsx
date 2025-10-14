import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { FitGroup } from "./FitGroup";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserMultipleChoiceQuestion } from "~/types/userTypes";
import _ from "lodash";

interface Props {
  data: UserMultipleChoiceQuestion;
  locked: boolean;
  answer: string | undefined;
  isPreview?: boolean;
}

const MultipleChoiceField = ({
  data,
  locked,
  answer,
  isPreview = false,
}: Props) => {
  const selectionFetcher = useFetcher();
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    if (answer) {
      setSelection(JSON.parse(answer));
    } else {
      setSelection([]);
    }
  }, [answer]);

  const handleOptionsSelect = useCallback(
    (option: string) => {
      if (data.config.multiSelect) {
        if (selection.includes(option)) {
          setSelection((prevState) => prevState.filter((q) => q !== option));
        } else {
          setSelection((prevState) => [...prevState, option]);
        }
      } else {
        setSelection([option]);
      }
    },
    [selection],
  );

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("answer", JSON.stringify(selection));
    selectionFetcher.submit(formData, {
      method: "POST",
      action: "/api/answer",
    });
  }, [selection]);

  const isDirty = useMemo(() => {
    if (!answer) return true;

    const parsedAnswer: string[] = JSON.parse(answer);

    return !_.isEqual(_.sortBy(selection), _.sortBy(parsedAnswer));
  }, [selection, answer]);

  return (
    <div className={"h-full flex flex-col"}>
      <FitGroup texts={data.config.options}>
        {(fontSize, getRef, getWrapperRef) => (
          <div
            className="h-full w-full grid gap-3 touch-manipulation"
            style={{
              gridTemplateRows: `repeat(${data.config.options.length}, minmax(0, 1fr))`,
            }}
          >
            {data.config.options.map((option, index) => (
              <div className="flex h-full overflow-hidden" key={index}>
                <Button
                  disabled={locked}
                  ref={getWrapperRef(index)}
                  onClick={() => handleOptionsSelect(option)}
                  className={`w-full h-full rounded-2xl outline-6 ${selection.includes(option) ? "outline-purple-700" : "outline-gray-200"} outline-solid -outline-offset-16 p-3 ${
                    data.config.trueOrFalse &&
                    (index % 2 === 0
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700")
                  }`}
                >
                  <div
                    ref={getRef(index)}
                    style={{ fontSize }}
                    className={`flex-1 ps-4 pe-6 whitespace-pre-wrap overflow-hidden flex justify-start`}
                  >
                    {data.config.showLetters && (
                      <div
                        style={{ lineHeight: 1 }}
                        className={`bg-gray-700 px-5 me-3 self-center content-center rounded-3xl aspect-square`}
                      >
                        {String.fromCharCode("A".charCodeAt(0) + index)}
                      </div>
                    )}
                    <span
                      className={`${data.config.showLetters ? "text-start" : "text-center"} w-full content-center`}
                    >
                      {option}
                    </span>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        )}
      </FitGroup>
      <div className="mt-4 shrink-0">
        <Button
          disabled={locked || isPreview || !isDirty}
          className={
            "w-full h-[100px] text-5xl bg-purple-700 hover:bg-purple-900"
          }
          onClick={handleSubmit}
        >
          Absenden
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoiceField;
