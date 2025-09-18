import { useFetcher, useLoaderData } from "react-router";
import { getConfig } from "~/utils/config.server";
import PointsGrid from "~/routes/show/components/PointsGrid";
import {
  answerRevealed,
  getActiveMatrix,
  getQuestion,
  initActiveMatrix,
} from "~/utils/playData.server";
import TeamsLine from "~/routes/show/components/TeamsLine";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo } from "react";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import type { QuestionEntity } from "@prisma/client";

export async function loader() {
  const config = getConfig();
  const question = getQuestion();
  let activeMatrix = getActiveMatrix();
  if (!activeMatrix) {
    activeMatrix = initActiveMatrix(
      config.categories.length,
      config.questionDepth,
    );
  }
  return { config, activeMatrix, question, answerRevealed };
}

export default function Show() {
  const questionEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{
    question: QuestionEntity;
    activeMatrix: boolean[][];
  }>();

  useEffect(() => {
    if (questionEvent) {
      try {
        fetcher.load("/api/question");
      } catch {}
    }
  }, [questionEvent]);

  const question =
    fetcher.data?.question !== undefined
      ? fetcher.data?.question
      : data.question;

  const activeMatrix =
    fetcher.data?.activeMatrix !== undefined
      ? fetcher.data?.activeMatrix
      : data.activeMatrix;

  const withHeader = useMemo(() => {
    if (question) {
      if (
        question.type === "buzzer" &&
        (question.config as any)?.media === undefined
      )
        return false;
      return question.type !== "none";
    } else {
      return false;
    }
  }, [question]);

  console.log(data);

  return (
    <main
      className="h-dvh w-dvw box-border px-4 pt-4 flex flex-col"
      style={{ fontFamily: "Unkempt, Love Ya Like A Sister, chalkduster" }}
    >
      {question ? (
        <BaseQuestionShow
          question={question}
          withHeader={withHeader}
          answerRevealed={data.answerRevealed === true}
        />
      ) : (
        <PointsGrid
          categories={data.config.categories}
          questions={data.config.questionDepth}
          activeMatrix={activeMatrix}
        />
      )}
      <TeamsLine />
    </main>
  );
}
