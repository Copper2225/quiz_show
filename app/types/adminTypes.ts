import type { QuestionEntity } from "@prisma/client";

export interface BuzzerQuestion extends QuestionEntity {
  config: {
    answer: string;
  };
}

export interface InputQuestion extends QuestionEntity {
  config: {
    answer: string;
  };
}

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

export type PinData = {
  xPercent: number;
  yPercent: number;
  teamColor: string;
  imgW?: number;
  imgH?: number;
};

export interface PinQuestion extends QuestionEntity {
  config: {
    image: string;
    pin: PinData;
  };
}

export interface MediaConfig {
  mediaChecked: boolean;
  mediaFile: string;
}

export interface PlayerPoints {
  points: number;
  pointsLog: Map<string, number>;
}
