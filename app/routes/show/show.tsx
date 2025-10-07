import { useLoaderData, useRevalidator } from "react-router";
import PointsGrid from "~/routes/show/components/PointsGrid";
import { ShowData } from "~/utils/playData.server";
import TeamsLine from "~/routes/show/components/TeamsLine";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo } from "react";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { QuestionType } from "~/types/question";

export async function loader() {
  return ShowData;
}

export default function Show() {
  const questionEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const disableEvent = useEventSource("/sse/events", {
    event: "disableEvent",
  });
  const data = useLoaderData<typeof loader>();
  const revalidate = useRevalidator();

  useEffect(() => {
    if (questionEvent || disableEvent) {
      revalidate.revalidate();
    }
  }, [questionEvent, disableEvent]);

  const question = data.currentQuestion;

  const activeMatrix = data.activeMatrix;

  const withHeader = useMemo(() => {
    if (question) {
      if (
        (question.type === QuestionType.BUZZER ||
          question.type === QuestionType.INPUT) &&
        (question.config as any)?.media === undefined
      )
        return data.answerRevealed;
      return question.type !== QuestionType.NONE;
    } else {
      return false;
    }
  }, [question, data.answerRevealed]);

  return (
    <main
      className="h-dvh w-dvw box-border px-4 pt-4 flex flex-col"
      style={{ fontFamily: "Unkempt, Love Ya Like A Sister, chalkduster" }}
    >
      <title>Show - Quiz</title>
      {question ? (
        <BaseQuestionShow
          question={question}
          withHeader={withHeader}
          answerRevealed={data.answerRevealed === true}
          answers={data.answers}
        />
      ) : (
        <PointsGrid
          categories={data.config.categories}
          questions={data.config.questionDepth}
          activeMatrix={activeMatrix}
        />
      )}
      <TeamsLine
        teams={data.teams}
        question={data.currentQuestion}
        answers={data.answers}
        userReveals={data.playerReveal}
      />
    </main>
  );
}
