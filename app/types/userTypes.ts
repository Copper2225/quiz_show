import type { QuestionEntity } from "@prisma/client";

export interface MultipleChoiceQuestion extends QuestionEntity {
  config: {
    options: { name: string; value: any }[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
}

export interface OrderQuestion extends QuestionEntity {
  config: {
    options: string[];
    shuffledOptions: string[];
  };
}

export interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: QuestionEntity | null;
}
