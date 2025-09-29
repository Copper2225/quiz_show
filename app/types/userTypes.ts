import type { QuestionEntity } from "@prisma/client";

export interface UserMultipleChoiceQuestion extends QuestionEntity {
  config: {
    options: string[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
}
export interface UserOrderQuestion extends QuestionEntity {
  config: {
    shuffledOptions: string[];
  };
}

export interface UserPinQuestion extends QuestionEntity {
  config: {
    image: string;
  };
}

export interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: QuestionEntity | null;
}
