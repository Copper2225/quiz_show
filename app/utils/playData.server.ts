import { prisma } from "~/utils/db.server";
import type { QuestionEntity } from "@prisma/client";

let userAnswerData: any | null = null;

export function setAnswerType(newAnswerType: object) {
  userAnswerData = newAnswerType;
}

export function getAnswerType() {
  return userAnswerData;
}

let activeMatrix: boolean[][] | null = null;

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
  if (activeMatrix !== null) {
    activeMatrix[category][question] = false;
  }
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

let currentQuestion: QuestionEntity | null = null;

export async function setQuestion(
  question: number,
  category: number,
): Promise<QuestionEntity | null> {
  currentQuestion = await prisma.questionEntity.findFirst({
    where: {
      categoryColumn: category,
      points: (question + 1) * 100,
    },
  });
  return currentQuestion;
}

export function clearQuestion() {
  currentQuestion = null;
  return currentQuestion;
}

export function getQuestion() {
  return currentQuestion;
}
