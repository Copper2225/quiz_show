import { prisma } from "~/utils/db.server";
import { initActiveMatrix } from "~/utils/playData.server";
import path from "node:path";
import * as fs from "node:fs";

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

export async function importQuestionsFromJson(): Promise<void> {
  const filePath = path.resolve(process.cwd(), "public", "config.json");

  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const entries: [string, any][] = JSON.parse(fileContents);

    if (!Array.isArray(entries)) {
      return;
    }

    for (const [, question] of entries) {
      if (!question) continue;

      await prisma.questionEntity.upsert({
        where: {
          categoryColumn_row: {
            categoryColumn: question.categoryColumn,
            row: question.row,
          },
        },
        update: {
          type: question.type,
          prompt: question.prompt,
          config: question.config,
          points: question.points,
        },
        create: {
          type: question.type,
          categoryColumn: question.categoryColumn,
          row: question.row,
          prompt: question.prompt,
          config: question.config,
          points: question.points,
        },
      });
    }

    console.log(`✅ Imported ${entries.length} questions from config.json`);
  } catch (err) {
    console.error("❌ Failed to import questions from JSON:", err);
  }
}

void initConfig();
