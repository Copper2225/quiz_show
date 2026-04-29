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

export type UserWaveLengthQuestion = Question<{
  showSlider: boolean;
  useNumber: boolean;
  emoji: boolean;
}>;

export type UserHint = {
  isInit: boolean;
  showInit: boolean;
  hint: string;
  emojis?: string[];
};
