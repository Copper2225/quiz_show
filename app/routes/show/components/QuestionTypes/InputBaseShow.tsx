import React from "react";
import ShowText from "~/routes/show/components/ShowText";
import type { InputQuestion } from "~/types/adminTypes";

interface Props {
  question: InputQuestion;
  withHeader: boolean;
  showAnswer: boolean;
}

const InputBaseShow = ({ question, withHeader, showAnswer }: Props) => {
  return (
    <div className={"flex flex-1 p-4 gap-4 overflow-hidden"}>
      {question.config?.media?.mediaChecked && (
        <div
          className={
            "w-full content-center h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12"
          }
        >
          <img
            className={"h-full justify-self-center object-contain"}
            src={(question.config as any)?.media?.mediaFile}
            alt={"Media"}
          />
        </div>
      )}
      {!withHeader && !showAnswer && <ShowText>{question.prompt}</ShowText>}
      {showAnswer && (
        <ShowText textColor={"var(--color-emerald-500)"}>
          {question.config.answer}
        </ShowText>
      )}
    </div>
  );
};

export default InputBaseShow;
