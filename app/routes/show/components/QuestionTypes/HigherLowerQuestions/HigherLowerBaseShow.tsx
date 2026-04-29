import { DynamicAxis } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/DynamicAxis";
import { useEffect, useMemo } from "react";
import type { HigherLowerQuestion } from "~/types/adminTypes";
import { useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { HigherLowerTile } from "~/routes/show/components/QuestionTypes/HigherLowerQuestions/HigherLowerTile";

interface Props {
  question: HigherLowerQuestion;
}

export const HigherLowerBaseShow: React.FC<Props> = ({ question }) => {
  const items = useMemo(
    () => question.config.options.filter((item) => item.show || item.showText),
    [question.config.options],
  );
  const leftItems = useMemo(
    () =>
      question.config.shuffledOptions.filter(
        (item) => !item.show && !item.showText,
      ),
    [question.config.shuffledOptions],
  );

  const revalidator = useRevalidator();
  const updateEvent = useEventSource("/sse/events", { event: "reveal" });

  useEffect(() => {
    if (updateEvent) {
      revalidator.revalidate();
    }
  }, [updateEvent]);

  console.log(question);

  return (
    <div className="flex flex-col items-center justify-around h-full w-full">
      <div className="w-full">
        <DynamicAxis
          max={question.config.options.length}
          items={items}
          lowLabel={question.config.lowLabel}
          highLabel={question.config.highLabel}
        />
      </div>
      <div className={"flex gap-10 mt-4 justify-center flex-wrap"}>
        {leftItems.map((item, index) => (
          <HigherLowerTile
            key={index}
            showText={false}
            imgSrc={item.imgSrc}
            value={item.value}
            label={item.label}
            max={question.config.options.length}
            inAxis={false}
          />
        ))}
      </div>
    </div>
  );
};
