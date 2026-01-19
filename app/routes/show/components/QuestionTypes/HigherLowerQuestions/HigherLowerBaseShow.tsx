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
    [question.config.options],
  );
  const revalidator = useRevalidator();
  const updateEvent = useEventSource("/sse/events", { event: "reveal" });

  useEffect(() => {
    if (updateEvent) {
      revalidator.revalidate();
    }
  }, [updateEvent]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <DynamicAxis max={question.config.options.length} items={items} />
      </div>
      <div className={"flex gap-5 mt-4 justify-center flex-wrap"}>
        {leftItems.map((item, index) => (
          <HigherLowerTile
            key={index}
            showText={false}
            imgSrc={item.imgSrc}
            text={item.text}
            max={question.config.options.length}
            inAxis={false}
          />
        ))}
      </div>
    </div>
  );
};
