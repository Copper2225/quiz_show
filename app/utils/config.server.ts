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

  const maxPoints = questions.reduce((max, question) => {
    return question.points > max ? question.points : max;
  }, 0);
  config.questionDepth = maxPoints > 0 ? Math.floor(maxPoints / 100) : 0;

  initActiveMatrix(config.categories.length, config.questionDepth);
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

export async function getQuestionsGrid(): Promise<Map<string, any>> {
  const questions = await prisma.questionEntity.findMany();

  config.categories.forEach((_category: string, catIndex: number) => {
    Array.from({ length: config.questionDepth }, (_, k) => {
      const question = questions.find(
        (question) =>
          question.categoryColumn === catIndex &&
          question.points / 100 - 1 === k,
      );
      if (question) {
        questionGrid.set(makeKey(catIndex, k), question);
      }
    });
  });

  return questionGrid;
}

void initConfig();
