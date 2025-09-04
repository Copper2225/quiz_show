let answerType: string | null = null;

export function setAnswerType(newAnswerType: string) {
  answerType = newAnswerType;
}

export function getAnswerType() {
  return answerType;
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

export function toggleActiveMatrix(category: number, question: number) {
  if (activeMatrix !== null) {
    activeMatrix[category][question] = !activeMatrix[category][question];
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
