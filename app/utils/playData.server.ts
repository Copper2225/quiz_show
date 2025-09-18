import { prisma } from "~/utils/db.server";
import type { QuestionEntity } from "@prisma/client";
import { broadcast } from "~/routes/events/sse.events";

let userAnswerData: any | null = null;

export function setAnswerType(newAnswerType: object) {
  userAnswerData = newAnswerType;
}

export function getAnswerType() {
  return userAnswerData;
}

let activeMatrix: boolean[][] = [];

export function getActiveMatrix() {
  return activeMatrix;
}

export function initActiveMatrix(categories: number, questions: number) {
  activeMatrix = Array.from({ length: categories }, () =>
    Array.from({ length: questions }, () => true),
  );
  return activeMatrix;
}

export function disableActiveMatrix(category: number, question: number) {
  activeMatrix[category][question] = false;
}

const teams: Map<string, number> = new Map();

export function getTeams() {
  return teams;
}

export function addTeam(name: string) {
  if (!teams.has(name)) {
    teams.set(name, 0);
  }
}

export function setTeamPoints(team: string, points: number) {
  teams.set(team, points);
}

let currentQuestion: QuestionEntity | null = null;

export async function setQuestion(
  question: number,
  category: number,
): Promise<QuestionEntity | null> {
  currentQuestion = await prisma.questionEntity.findFirst({
    where: {
      categoryColumn: category,
      row: question,
    },
  });
  return currentQuestion;
}

export function clearQuestion() {
  currentQuestion = null;
  setAnswerRevealed(false);
  broadcast("reveal", { revealed: "false" });
  return currentQuestion;
}

export function getQuestion() {
  return currentQuestion;
}

const answerLock = new Map<string, boolean>();

export function setAllLocked(lock: boolean) {
  for (const key of teams.keys()) {
    answerLock.set(key, lock);
  }
}

export function setUserLocked(user: string, lock: boolean) {
  answerLock.set(user, lock);
}

export function getIsUserLocked(user: string): boolean | undefined {
  return answerLock.get(user);
}

export function isAnyLocked(): boolean {
  return Array.from(answerLock.values()).some((isLocked) => isLocked);
}

const answers: Map<string, { answer: string; time: Date }> = new Map();

export function clearUserAnswers() {
  answers.clear();
}

export function setUserAnswer(
  user: string | undefined,
  answer: string,
  time: Date,
): void {
  if (user) {
    answers.set(user, { answer, time });
  }
}

export function getUserAnswer(
  user: string | undefined,
): { answer: string; time: Date } | undefined {
  if (user) {
    return answers.get(user);
  }
}

export function getAnswers() {
  return answers;
}

export let answerRevealed = false;

export function setAnswerRevealed(paramAnswerRevealed: boolean) {
  answerRevealed = paramAnswerRevealed;
}
