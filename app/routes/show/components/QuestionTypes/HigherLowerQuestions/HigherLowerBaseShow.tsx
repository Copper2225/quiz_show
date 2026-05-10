import { DynamicAxis } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/DynamicAxis";
import { useEffect, useMemo } from "react";
import type { HigherLowerQuestion } from "~/types/adminTypes";
import { useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { HigherLowerTile } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/HigherLowerTile";

interface Props {
  question: HigherLowerQuestion;
  showAnswer: boolean;
}

export const HigherLowerBaseShow: React.FC<Props> = ({ question, showAnswer }) => {
  const items = useMemo(
    () =>
      question.config.options
        .filter((item) => item.show || item.showText)
        .sort((a, b) => Number(a.value) - Number(b.value)),
    [question.config.options],
  );
  const leftItems = useMemo(
    () =>
      showAnswer ? [] :
      (question.config.shuffledOptions ?? []).filter(
        (item) => !item.show && !item.showText,
      ),
    [question.config.shuffledOptions, showAnswer],
  );

  const { upperRow, lowerRow } = useMemo(() => {
    if (leftItems.length >= 9) {
      const splitIndex = Math.ceil(leftItems.length / 2);
      return {
        upperRow: leftItems.slice(0, splitIndex),
        lowerRow: leftItems.slice(splitIndex),
      };
    }
    return { upperRow: leftItems, lowerRow: [] };
  }, [leftItems, showAnswer]);

  const revalidator = useRevalidator();
  const updateEvent = useEventSource("/sse/events", { event: "reveal" });

  useEffect(() => {
    if (updateEvent) {
      revalidator.revalidate();
    }
  }, [updateEvent]);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full py-4">
      <div className="w-full">
        <DynamicAxis
          max={question.config.options.length}
          items={showAnswer ? question.config.options : items}
          lowLabel={question.config.lowLabel}
          highLabel={question.config.highLabel}
          forceSquare={question.config.forceSquare}
          forceReveal={question.config.revealSolution}
          showAnswer={showAnswer}
        />
      </div>
      <div
        className={`flex flex-col absolute bottom-0 gap-y-12 px-12 ${lowerRow.length > 0 ? "justify-between" : "justify-center"} w-full`}
      >
        <div className="flex gap-x-12 justify-around flex-wrap">
          {upperRow.map((item, index) => (
            <HigherLowerTile
              key={index}
              showText={false}
              imgSrc={item.imgSrc}
              value={item.value}
              forceSquare={question.config.forceSquare}
              label={item.label}
              max={question.config.options.length}
              inAxis={false}
            />
          ))}
        </div>
        {lowerRow.length > 0 && (
          <div className="flex gap-x-12 justify-around flex-wrap mb-8">
            {lowerRow.map((item, index) => (
              <HigherLowerTile
                key={index}
                showText={false}
                imgSrc={item.imgSrc}
                value={item.value}
                forceSquare={question.config.forceSquare}
                label={item.label}
                max={question.config.options.length}
                inAxis={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
