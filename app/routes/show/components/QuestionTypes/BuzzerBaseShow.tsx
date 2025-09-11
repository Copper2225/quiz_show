import React from "react";
import type { QuestionEntity } from "@prisma/client";

interface Props {
  question: QuestionEntity;
  withHeader: boolean;
}

const BuzzerBaseShow = ({ question, withHeader }: Props) => {
  return (
    <div className={"flex flex-1 p-4 gap-4 overflow-hidden"}>
      {(question.config as any)?.media?.mediaChecked && (
        <div
          className={
            "w-full content-center h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12"
          }
        >
          <img
            className={"h-full justify-self-center"}
            src={(question.config as any)?.media?.mediaFile}
            alt={"Media"}
          />
        </div>
      )}
      {!withHeader && (
        <div className={"self-center w-full text-center text-7xl"}>
          {question.prompt}
        </div>
      )}
    </div>
  );
};

export default BuzzerBaseShow;
