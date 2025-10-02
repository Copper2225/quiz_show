import type { Question } from "~/types/question";

export type BuzzerQuestion = Question<{ answer: string }>;

export type InputQuestion = Question<{ answer: string }>;

export type MultipleChoiceQuestion = Question<{
  options: { name: string; checked?: "on" | "off" }[];
  showLetters: "on" | "off";
  trueOrFalse: "on" | "off";
  shuffle: "on" | "off";
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

export interface MediaConfig {
  mediaChecked: boolean;
  mediaFile: string;
}

export interface PlayerPoints {
  points: number;
  pointsLog: Map<string, number>;
}
