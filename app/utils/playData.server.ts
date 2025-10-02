import { prisma } from "~/utils/db.server";
import { broadcast } from "~/routes/events/sse.events";
import {
  type Config,
  getConfig,
  getQuestionsGrid,
} from "~/utils/config.server";
import _ from "lodash";
import { userColors } from "~/routes/show/userColors";
import { type Question, QuestionType } from "~/types/question";

interface PlayerData {
  answerType: any | null;
  userLocks: Map<string, boolean>;
  question: Question<any> | null;
}

interface AdminDataShape {
  activeMatrix: boolean[][];
  currentQuestion: Question<any> | null;
  answers: Map<string, { answer: string; time: Date }>;
  teams: Map<string, number>;
  answerRevealed: boolean;
  config: Config;
  questionGrid: Map<string, Question<any>>;
  playerReveal: Map<string, boolean>;
}

interface SpecificUserData {
  isLocked: boolean | undefined;
  answer: { answer: string; time: Date } | undefined;
  userName: string;
  userColor: string;
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
    userColor: userColors[Array.from(AdminData.teams.keys()).indexOf(user)],
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

export function disableActiveMatrix(
  category: number,
  question: number,
  switching: boolean = false,
) {
  AdminData.activeMatrix[category][question] = switching
    ? !AdminData.activeMatrix[category][question]
    : false;
}

export function resetActiveMatrix() {
  AdminData.activeMatrix = Array.from(
    { length: getConfig().categories.length },
    () => Array.from({ length: getConfig().questionDepth }, () => true),
  );
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
): Promise<Question<any> | null> {
  const foundQuestionEntity = (await prisma.questionEntity.findFirst({
    where: {
      categoryColumn: category,
      row: question,
    },
  })) as Question<any>;

  if (!foundQuestionEntity) {
    AdminData.currentQuestion = null;
    return null;
  }
  let config: any = {};
  if (foundQuestionEntity.config) {
    try {
      config = JSON.parse(foundQuestionEntity.config);
    } catch (e) {
      console.error("Failed to parse question config", e);
    }
  }

  if (
    (config.shuffle === "on" ||
      foundQuestionEntity.type === QuestionType.ORDER) &&
    Array.isArray(config.options)
  ) {
    if (foundQuestionEntity.type === QuestionType.ORDER) {
      config.shuffledOptions = _.shuffle(config.options);
    } else {
      config.options = _.shuffle(config.options);
    }
  }

  const foundQuestion: Question<any> = {
    ...foundQuestionEntity,
    config,
  };

  AdminData.currentQuestion = foundQuestion;

  playerData.question = {
    ...foundQuestion,
    config: {
      ...config,
      answer: undefined,
      options:
        foundQuestion.type !== QuestionType.ORDER
          ? config.options?.map((o: { name: string }) => o.name)
          : undefined,
    },
  };

  if (foundQuestion.type === QuestionType.PIN) {
    playerData.question.config.pin = undefined;
  }

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
