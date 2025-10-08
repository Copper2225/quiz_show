import { prisma } from "~/utils/db.server";
import { initActiveMatrix } from "~/utils/playData.server";

export interface Config {
  categories: string[];
  questionDepth: number;
}

const config: Config = { categories: [], questionDepth: 0 };

export async function initConfig(): Promise<void> {
  const [categories, questions] = await Promise.all([
    prisma.categoryEntity.findMany(),
    prisma.questionEntity.findMany(),
  ]);

  const maxColumn = categories.reduce((max, category) => {
    return category.column > max ? category.column : max;
  }, -1);

  const mappedCategories: string[] = Array.from(
    { length: Math.max(0, maxColumn + 1) },
    () => "",
  );

  categories.forEach((category) => {
    mappedCategories[category.column] = category.name;
  });
  config.categories = mappedCategories;

  const maxRow = questions.reduce((max, question) => {
    return question.row > max ? question.row : max;
  }, 0);

  config.questionDepth = maxRow + 1;

  initActiveMatrix(config.categories.length, maxRow + 1);
}

export function addCategory(): void {
  config.categories.push("");
}

export async function setCategory(
  category: string,
  index: number,
): Promise<void> {
  config.categories[index] = category;
  await prisma.categoryEntity.upsert({
    where: {
      column: index,
    },
    update: {
      name: category,
    },
    create: {
      column: index,
      name: category,
    },
  });
}

export function addQuestionDepth(): void {
  config.questionDepth++;
}

export function getConfig(): Config {
  return config;
}

const questionGrid = new Map<string, any>();

function makeKey(c: number, q: number) {
  return `${c}:${q}`;
}

export async function initQuestionGrid(): Promise<void> {
  const questions = await prisma.questionEntity.findMany();

  config.categories.forEach((_category: string, catIndex: number) => {
    Array.from({ length: config.questionDepth }, (_, k) => {
      const question = questions.find(
        (question) =>
          question.categoryColumn === catIndex && question.row === k,
      );
      if (question) {
        questionGrid.set(makeKey(catIndex, k), question);
      } else {
        questionGrid.delete(makeKey(catIndex, k));
      }
    });
  });
}

export function getQuestionsGrid(): Map<string, any> {
  return questionGrid;
}

void initConfig();
