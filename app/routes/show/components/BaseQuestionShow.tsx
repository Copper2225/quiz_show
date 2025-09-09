import type { QuestionEntity } from "@prisma/client";
import MultipleChoiceBaseShow from "~/routes/Show/components/MultipleChoiceBaseShow";
import { useMemo } from "react";
import type { MultipleChoiceQuestion } from "~/types/userTypes";

interface Props {
  question: QuestionEntity;
  withHeader: boolean;
}

const BaseQuestionShow = ({ question, withHeader }: Props) => {
  const detailed = useMemo(() => {
    return (
      <MultipleChoiceBaseShow
        data={(question as MultipleChoiceQuestion).config}
      />
    );
  }, [question]);

  return (
    <div
      className={
        "bg-gray-800 border-teal-700 border-4 rounded-3xl w-7/8 flex-1 min-h-0 self-center flex flex-col text-5xl"
      }
    >
      {withHeader && (
        <div
          style={{
            borderRadius:
              "calc(var(--radius-3xl) - 4px) calc(var(--radius-3xl) - 4px) 0 0",
          }}
          className={"bg-purple-700 rounded-t-3xl px-4 py-2 text-center"}
        >
          {question.prompt}
        </div>
      )}
      {detailed}
    </div>
  );
};

export default BaseQuestionShow;
