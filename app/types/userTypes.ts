import type { QuestionEntity } from "@prisma/client";

export interface MultipleChoiceQuestion extends QuestionEntity {
  config: {
    options: { name: string; value: any }[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
}
