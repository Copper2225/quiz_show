import type { Question } from "~/types/question";

export type UserMultipleChoiceQuestion = Question<{
  config: {
    options: string[];
    showLetters: "on" | "off";
    trueOrFalse: "on" | "off";
  };
}>;

export type UserOrderQuestion = Question<{
  config: {
    shuffledOptions: string[];
  };
}>;

export type UserPinQuestion = Question<{
  config: {
    image: string;
  };
}>;

export interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: Question<any> | null;
}
