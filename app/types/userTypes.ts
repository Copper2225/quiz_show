import type { JsonValue } from "@prisma/client/runtime/client";
import type { Question } from "~/types/question";

export type UserMultipleChoiceQuestion = Question<{
  options: string[];
  showLetters: boolean;
  trueOrFalse: boolean;
  multiSelect: boolean;
}>;

export type UserOrderQuestion = Question<{
  shuffledOptions: string[];
}>;

export type UserPinQuestion = Question<{
  image: string;
}>;

export interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: Question<JsonValue> | null;
}
