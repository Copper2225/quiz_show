import { prisma } from "~/utils/db.server";
import { broadcast } from "~/routes/events/sse.events";
import {
  type Config,
  getConfig,
  getQuestionsGrid,
} from "~/utils/config.server";
import { userColors } from "~/routes/show/userColors";
import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import type {
  HigherLowerQuestion,
  WavelengthQuestion,
} from "~/types/adminTypes";
import _ from "lodash";
import type { UserHint, UserWaveLengthQuestion } from "~/types/userTypes";
const { random } = _;

interface PlayerData {
  question: Question<JsonValue> | null;
}

interface AdminDataShape {
  activeMatrix: boolean[][];
  currentQuestion: Question<JsonValue> | null;
  answers: Map<string, { answer: string; time: Date }>;
  teams: Map<string, number>;
  answerRevealed: boolean;
  config: Config;
  questionGrid: Map<string, Question<JsonValue>>;
  playerReveal: Map<string, boolean>;
  userLocks: Map<string, boolean>;
  userHints: Map<string, UserHint>;
  questionRevealTime: Date | null;
  currentSelector: number;
  showCurrentSelector: boolean;
  qlcConfigs: Map<string, string>;
}

interface SpecificUserData {
  isLocked: boolean | undefined;
  answer: { answer: string; time: Date } | undefined;
  userName: string;
  userColor: string;
  userHint: UserHint | undefined;
}

export const playerData: PlayerData = {
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
  userLocks: new Map<string, boolean>(),
  userHints: new Map<string, UserHint>(),
  questionRevealTime: null,
  currentSelector: -1,
  showCurrentSelector: false,
  qlcConfigs: new Map<string, string>(),
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
  get userLocks() {
    return AdminData.userLocks;
  },
  get questionRevealTime() {
    return AdminData.questionRevealTime;
  },
  get showCurrentSelector() {
    return AdminData.showCurrentSelector;
  },
  get currentSelector() {
    return AdminData.currentSelector;
  },
  get questionGrid() {
    return AdminData.questionGrid;
  },
  get qlcConfigs() {
    return AdminData.qlcConfigs;
  },
};

export function getUserData(user: string): SpecificUserData {
  return {
    isLocked: getIsUserLocked(user),
    answer: getUserAnswer(user),
    userName: user,
    userColor: userColors[Array.from(AdminData.teams.keys()).indexOf(user)],
    userHint: getUserShowHint(user),
  };
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
  if (
    AdminData.showCurrentSelector &&
    AdminData.activeMatrix[category][question]
  ) {
    AdminData.currentSelector =
      (AdminData.currentSelector + 1) % Array.from(AdminData.teams).length;
  }

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

export async function setQuestion(question: Question<JsonValue>) {
  const config = question.config as any;

  AdminData.questionRevealTime = new Date();

  AdminData.currentQuestion = question;

  playerData.question = {
    ...question,
    config: {
      ...config,
      answer: undefined,
      options:
        question.type !== QuestionType.ORDER
          ? config.options?.map((o: { name: string }) => o.name)
          : undefined,
    },
  };

  if (question.type === QuestionType.PIN) {
    (playerData.question.config as any).pin = undefined;
  }

  if (
    question.type === QuestionType.HIGHER_LOWER ||
    question.type === QuestionType.ORDER
  ) {
    if (!config.shuffledOptions && Array.isArray(config.options)) {
      config.shuffledOptions = _.shuffle(config.options);
    } else if (
      Array.isArray(config.shuffledOptions) &&
      Array.isArray(config.options) &&
      question.type === QuestionType.HIGHER_LOWER
    ) {
      config.shuffledOptions.forEach((shuffledItem: any) => {
        const originalItem = config.options.find(
          (o: any) => o.value === shuffledItem.value,
        );
        if (originalItem) {
          shuffledItem.show = originalItem.show;
          shuffledItem.showText = originalItem.showText;
        }
      });
    }
  }

  if (
    config.shuffle &&
    question.type !== QuestionType.HIGHER_LOWER &&
    question.type !== QuestionType.ORDER &&
    Array.isArray(config.options)
  ) {
    config.options = _.shuffle(config.options);
  }

  if (question.type === QuestionType.HIGHER_LOWER) {
    Array.from(AdminData.teams.keys()).map((team) => {
      setUserAnswer(team, "♥︎♥︎♥︎", new Date());
    });
    config.options = config.options.reverse();
    setAllPlayerReveal(true);
    (AdminData.currentQuestion as HigherLowerQuestion).config.selector = random(
      AdminData.teams.size - 1,
    );
  }

  if (question.type === QuestionType.WAVELENGTH) {
    const config = question.config as any;
    (playerData.question as UserWaveLengthQuestion).config.emoji =
      config.emoji ?? false;
    (playerData.question as UserWaveLengthQuestion).config.useNumber =
      config.useNumber ?? false;
    if (config.random) {
      const answer = random(10);
      (playerData.question as UserWaveLengthQuestion).config.showSlider = false;
      (
        AdminData.currentQuestion as any as WavelengthQuestion
      ).config.numberAnswer = [answer];
      (playerData.question as UserWaveLengthQuestion).config.showSlider = false;
      (AdminData.currentQuestion as any as WavelengthQuestion).config.answer =
        answer.toString();
      setAllHints(answer.toString());
    } else if (config.useNumber) {
      setAllHints(config.numberAnswer.toString());
      (AdminData.currentQuestion as any as WavelengthQuestion).config.answer =
        config.numberAnswer.toString();
    } else {
      setAllHints(config.answer);
    }
  }

  return AdminData.currentQuestion;
}

export async function setQuestionWithRowAndCat(
  question: number,
  category: number,
) {
  const foundQuestion = await loadQuestion(question, category);
  if (foundQuestion) {
    return await setQuestion(foundQuestion);
  } else {
    return null;
  }
}

export async function loadQuestion(
  question: number,
  category: number,
): Promise<Question<JsonValue> | null> {
  const foundQuestionEntity = (await prisma.questionEntity.findFirst({
    where: {
      categoryColumn: category,
      row: question,
    },
  })) as Question<JsonValue>;

  if (!foundQuestionEntity) {
    AdminData.currentQuestion = null;
    AdminData.questionRevealTime = null;
    return null;
  }
  const config: any = foundQuestionEntity.config;

  if (
    (config.shuffle ||
      foundQuestionEntity.type === QuestionType.ORDER ||
      foundQuestionEntity.type === QuestionType.HIGHER_LOWER) &&
    Array.isArray(config.options)
  ) {
    if (
      foundQuestionEntity.type === QuestionType.ORDER ||
      foundQuestionEntity.type === QuestionType.HIGHER_LOWER
    ) {
      if (!config.shuffledOptions) {
        config.shuffledOptions = _.shuffle(config.options);
      } else {
        config.shuffledOptions.forEach((shuffledItem: any) => {
          const originalItem = config.options.find(
            (o: any) => o.value === shuffledItem.value,
          );
          if (originalItem) {
            shuffledItem.show = originalItem.show;
            shuffledItem.showText = originalItem.showText;
          }
        });
      }
    } else {
      config.options = _.shuffle(config.options);
    }
  }

  return {
    ...foundQuestionEntity,
    config,
  };
}

export function clearQuestion() {
  AdminData.currentQuestion = null;
  playerData.question = null;
  setAnswerRevealed(false);
  broadcast("reveal", {
    revealed: "false",
    selector: AdminData.currentSelector,
    showSelector: AdminData.showCurrentSelector,
  });
  return AdminData.currentQuestion;
}

export function setAllLocked(lock: boolean) {
  for (const key of AdminData.teams.keys()) {
    AdminData.userLocks.set(key, lock);
  }
}

export function setUserLocked(user: string, lock: boolean) {
  AdminData.userLocks.set(user, lock);
}

export function getIsUserLocked(user: string): boolean | undefined {
  return AdminData.userLocks.get(user);
}

export function setAllHints(hint: string, showInit: boolean = false) {
  for (const key of AdminData.teams.keys()) {
    AdminData.userHints.set(key, { isInit: true, showInit: showInit, hint });
  }
}

export function setUserShowHint(
  user: string,
  isInit: boolean,
  hint: string,
  showInit = false,
) {
  AdminData.userHints.set(user, { isInit, showInit, hint });
}

export function getUserShowHint(user: string): UserHint | undefined {
  return AdminData.userHints.get(user);
}

export function isAnyLocked(): boolean {
  return Array.from(AdminData.userLocks.values()).some((isLocked) => isLocked);
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

export function removeUserAnswer(user: string | undefined): void {
  if (user) {
    AdminData.answers.delete(user);
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

export async function initQLCConfigs() {
  const configs = await prisma.qLCConfig.findMany();
  AdminData.qlcConfigs.clear();
  configs.forEach((c) => AdminData.qlcConfigs.set(c.key, c.widgetId));
}

void initQLCConfigs();
