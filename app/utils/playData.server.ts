import { prisma } from "~/utils/db.server";
import type { QuestionEntity } from "@prisma/client";
import { broadcast } from "~/routes/events/sse.events";
import {
  type Config,
  getConfig,
  getQuestionsGrid,
} from "~/utils/config.server";
import _ from "lodash";

interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: QuestionEntity | null;
}

interface AdminDataShape {
  activeMatrix: boolean[][];
  currentQuestion: QuestionEntity | null;
  answers: Map<string, { answer: string; time: Date }>;
  teams: Map<string, number>;
  answerRevealed: boolean;
  config: Config;
  questionGrid: Map<string, QuestionEntity>;
  playerReveal: Map<string, boolean>;
}

interface SpecificUserData {
  isLocked: boolean | undefined;
  answer: { answer: string; time: Date } | undefined;
  userName: string;
}

export const playerData: PlayerData = {
  answerType: null,
  userLocks: new Map<string, boolean>(),
  question: null,
};

export const AdminData: AdminDataShape = {
  activeMatrix: [],
  currentQuestion: null,
  answers: new Map<string, { answer: string; time: Date }>(),
  teams: new Map<string, number>(),
  answerRevealed: false,
  config: getConfig(),
  questionGrid: getQuestionsGrid(),
  playerReveal: new Map<string, boolean>(),
};

export const ShowData = {
  get activeMatrix() {
    return AdminData.activeMatrix;
  },
  get currentQuestion() {
    return AdminData.currentQuestion;
  },
  get answerRevealed() {
    return AdminData.answerRevealed;
  },
  get teams() {
    return AdminData.teams;
  },
  get answers() {
    return AdminData.answers;
  },
  get config() {
    return AdminData.config;
  },
  get playerReveal() {
    return AdminData.playerReveal;
  },
};

export function getUserData(user: string): SpecificUserData {
  return {
    isLocked: getIsUserLocked(user),
    answer: getUserAnswer(user),
    userName: user,
  };
}

export function setAnswerType(newAnswerType: object) {
  playerData.answerType = newAnswerType;
}

export function initActiveMatrix(categories: number, questions: number) {
  AdminData.activeMatrix = Array.from({ length: categories }, () =>
    Array.from({ length: questions }, () => true),
  );
  return AdminData.activeMatrix;
}

export function disableActiveMatrix(category: number, question: number) {
  AdminData.activeMatrix[category][question] = false;
}

export function addTeam(name: string) {
  if (!AdminData.teams.has(name)) {
    AdminData.teams.set(name, 0);
  }
}

export function setTeamPoints(team: string, points: number) {
  AdminData.teams.set(team, points);
}

export async function setQuestion(
  question: number,
  category: number,
): Promise<QuestionEntity | null> {
  const foundQuestion = await prisma.questionEntity.findFirst({
    where: {
      categoryColumn: category,
      row: question,
    },
  });

  if (!foundQuestion) {
    AdminData.currentQuestion = null;
    return null;
  }

  console.log(foundQuestion);

  if (
    foundQuestion.config &&
    ((foundQuestion.config as any).shuffle === "on" ||
      foundQuestion.type === "order") &&
    Array.isArray((foundQuestion.config as any).options)
  ) {
    const cfg = foundQuestion.config as any;
    if (foundQuestion.type === "order") {
      cfg.shuffledOptions = _.shuffle(cfg.options);
    } else {
      cfg.options = _.shuffle(cfg.options);
    }
    foundQuestion.config = cfg;
  }

  AdminData.currentQuestion = foundQuestion;
  playerData.question = {
    ...foundQuestion,
    config: {
      ...(foundQuestion.config as any),
      answer: undefined,
      options:
        foundQuestion.type !== "order"
          ? (foundQuestion.config as any).options?.map(
              (o: { name: string }) => o.name,
            )
          : undefined,
    },
  };

  return AdminData.currentQuestion;
}

export function clearQuestion() {
  AdminData.currentQuestion = null;
  playerData.question = null;
  setAnswerRevealed(false);
  broadcast("reveal", { revealed: "false" });
  return AdminData.currentQuestion;
}

export function setAllLocked(lock: boolean) {
  for (const key of AdminData.teams.keys()) {
    playerData.userLocks.set(key, lock);
  }
}

export function setUserLocked(user: string, lock: boolean) {
  playerData.userLocks.set(user, lock);
}

export function getIsUserLocked(user: string): boolean | undefined {
  return playerData.userLocks.get(user);
}

export function isAnyLocked(): boolean {
  return Array.from(playerData.userLocks.values()).some((isLocked) => isLocked);
}

export function clearUserAnswers() {
  AdminData.answers.clear();
  setAllPlayerReveal(false);
}

export function setUserAnswer(
  user: string | undefined,
  answer: string,
  time: Date,
): void {
  if (user) {
    AdminData.answers.set(user, { answer, time });
  }
}

export function getUserAnswer(
  user: string | undefined,
): { answer: string; time: Date } | undefined {
  if (user) {
    return AdminData.answers.get(user);
  }
}

export function setAnswerRevealed(paramAnswerRevealed: boolean) {
  AdminData.answerRevealed = paramAnswerRevealed;
}

export function setUserRevealed(user: string, paramRevealed: boolean) {
  AdminData.playerReveal.set(user, paramRevealed);
}

export function setAllPlayerReveal(reveal: boolean) {
  for (const key of AdminData.teams.keys()) {
    AdminData.playerReveal.set(key, reveal);
  }
}
