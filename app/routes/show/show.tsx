import { useLoaderData } from "react-router";
import PointsGrid from "~/routes/show/components/PointsGrid";
import { AdminData, ShowData } from "~/utils/playData.server";
import TeamsLine from "~/routes/show/components/TeamsLine";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo } from "react";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { QuestionType } from "~/types/question";
import type { BuzzerQuestion, InputQuestion } from "~/types/adminTypes";
import { QLCConnection } from "~/components/QLCConnection";
import { useQLCCommands } from "~/utils/useQLCCommands";
import { connectQLC, isConnected } from "~/utils/qlc.client";

export async function loader() {
  return {
    ...ShowData,
    qlcConfigs: Object.fromEntries(ShowData.qlcConfigs),
    userHints: Object.fromEntries(AdminData.userHints),
  };
}

export default function Show() {
  const questionEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const disableEvent = useEventSource("/sse/events", {
    event: "disableEvent",
  });

  const data = useLoaderData<typeof loader>();

  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });
  const selectorEvent = useEventSource("/sse/events/admin", {
    event: "selector",
  });
  const answerUserEvent = useEventSource("/sse/events/admin", {
    event: "answer",
  });
  const clearEvent = useEventSource("/sse/events", { event: "clearAnswers" });
  const lockEvent = useEventSource("/sse/events", {
    event: "lockAnswers",
  });
  const userRevealEvent = useEventSource("/sse/events", {
    event: "revealUser",
  });
  const wrongEvent = useEventSource("/sse/events", { event: "wrongAnswer" });

  const revealEvent = useEventSource("/sse/events", { event: "reveal" });

  useEffect(() => {
    if (!isConnected()) {
      connectQLC();
    }
  }, []);

  useQLCCommands(data.qlcConfigs as any, [
    wrongEvent,
    pointsEvent,
    selectorEvent,
    answerUserEvent,
    clearEvent,
    lockEvent,
    questionEvent,
    disableEvent,
    userRevealEvent,
    revealEvent,
  ]);

  const question = data.currentQuestion;

  const activeMatrix = data.activeMatrix;

  const withHeader = useMemo(() => {
    if (!question) return false;

    const hasUncheckedMedia =
      (question.type === QuestionType.BUZZER &&
        !(question as BuzzerQuestion).config.media?.mediaChecked) ||
      (question.type === QuestionType.INPUT &&
        !(question as InputQuestion).config.media?.mediaChecked);

    if (hasUncheckedMedia) {
      return data.answerRevealed;
    }

    return question.type !== QuestionType.NONE;
  }, [question, data.answerRevealed]);

  return (
    <>
      <QLCConnection hidden={true} />
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
            playerReveals={data.playerReveal}
            userHints={new Map(Object.entries(data.userHints))}
          />
        ) : (
          <PointsGrid
            categories={data.config.categories}
            questionDepth={data.config.questionDepth}
            questions={data.questionGrid}
            activeMatrix={activeMatrix}
          />
        )}
        <TeamsLine
          teams={data.teams}
          question={data.currentQuestion}
          answers={data.answers}
          userReveals={data.playerReveal}
          questionRevealTime={data.questionRevealTime}
          showSelector={data.showCurrentSelector}
          currentSelector={data.currentSelector}
        />
      </main>
    </>
  );
}
