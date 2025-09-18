import type { QuestionEntity } from "@prisma/client";

export interface BuzzerQuestion extends QuestionEntity {
  config: {
    answer: string;
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
