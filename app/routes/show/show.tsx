import { useLoaderData, useRevalidator } from "react-router";
import PointsGrid from "~/routes/show/components/PointsGrid";
import { ShowData } from "~/utils/playData.server";
import TeamsLine from "~/routes/show/components/TeamsLine";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo, useState } from "react";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { QuestionType } from "~/types/question";
import type {
  BuzzerQuestion,
  InputQuestion,
  WavelengthQuestion,
} from "~/types/adminTypes";

export async function loader() {
  return ShowData;
}

export default function Show() {
  const [showWrong, setShowWrong] = useState(false);
  const questionEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const disableEvent = useEventSource("/sse/events", {
    event: "disableEvent",
  });

  const data = useLoaderData<typeof loader>();
  const revalidate = useRevalidator();

  const wrongEvent = useEventSource("/sse/events", { event: "wrongAnswer" });

  useEffect(() => {
    if (wrongEvent) {
      setShowWrong(true);

      // Remove it after 1.5 seconds
      const timer = setTimeout(() => setShowWrong(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wrongEvent]);

  useEffect(() => {
    if (questionEvent || disableEvent) {
      revalidate.revalidate();
    }
  }, [questionEvent, disableEvent]);

  const question = data.currentQuestion;

  const activeMatrix = data.activeMatrix;

  const withHeader = useMemo(() => {
    if (!question) return false;

    const hasUncheckedMedia =
      (question.type === QuestionType.BUZZER &&
        !(question as BuzzerQuestion).config.media?.mediaChecked) ||
      (question.type === QuestionType.INPUT &&
        !(question as InputQuestion).config.media?.mediaChecked) ||
      (question.type === QuestionType.WAVELENGTH &&
        !(question as WavelengthQuestion).config.media?.mediaChecked);

    if (hasUncheckedMedia) {
      return data.answerRevealed;
    }

    return question.type !== QuestionType.NONE;
  }, [question, data.answerRevealed]);


  return (
    <>
      <div
        className={`
          pointer-events-none fixed inset-0 z-50
          shadow-[inset_0_0_150px_60px_rgba(239,68,68,1)]
          /* Logic: Fast fade-in, slow fade-out */
          transition-all transform
          ${
            showWrong
              ? "opacity-100 scale-100 duration-150 ease-out"
              : "opacity-0 scale-110 duration-1000 ease-in"
          }
        `}
      />
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
