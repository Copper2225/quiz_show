import type { QuestionEntity } from "@prisma/client";

export const QuestionType = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  BUZZER: "BUZZER",
  INPUT: "INPUT",
  PIN: "PIN",
  ORDER: "ORDER",
  NONE: "NONE",
} as const;

export type Question<ConfigType> = Omit<QuestionEntity, "config"> & {
  type: QuestionType;
  config: ConfigType;
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
