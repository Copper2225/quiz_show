import type { Question } from "~/types/question";

export type MediaConfig = {
  mediaChecked: boolean;
  mediaFile: string;
};

export type BuzzerQuestion = Question<{
  answer: string;
  media?: MediaConfig;
}>;

export type InputQuestion = Question<{
  answer: string;
  media?: MediaConfig;
}>;

export type MultipleChoiceQuestion = Question<{
  options: { name: string; checked?: boolean }[];
  showLetters: boolean;
  trueOrFalse: boolean;
  shuffle: boolean;
  multiSelect: boolean;
}>;

export type OrderQuestion = Question<{
  options: string[];
  shuffledOptions: string[];
}>;

export type PinData = {
  xPercent: number;
  yPercent: number;
  teamColor: string;
  imgW?: number;
  imgH?: number;
};

export type PinQuestion = Question<{
  image: string;
  pin: PinData;
}>;

export interface PlayerPoints {
  points: number;
  pointsLog: Map<string, number>;
}
