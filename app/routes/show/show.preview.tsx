import { AdminData } from "~/utils/playData.server";
import { useCallback, useMemo, useState } from "react";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { type Question, QuestionType } from "~/types/question";
import type { Route } from ".react-router/types/app/routes/admin/+types/admin.peek";
import { prisma } from "~/utils/db.server";
import type { JsonValue } from "@prisma/client/runtime/client";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export async function loader({ params }: Route.LoaderArgs) {
  const c = Number(params.c);
  const q = Number(params.q);

  if (!Number.isInteger(c) || !Number.isInteger(q)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const question = (await prisma.questionEntity.findUnique({
    where: {
      categoryColumn_row: {
        categoryColumn: c,
        row: q,
      },
    },
  })) as Question<JsonValue>;

  const { config, activeMatrix, questionGrid } = AdminData;
  return {
    question,
    activeMatrix,
    categories: config.categories,
    grid: questionGrid,
  };
}

export default function Show() {
  const [showCorrect, setShowCorrect] = useState(false);
  const navigate = useNavigate();
  const { question } = useLoaderData<typeof loader>();

  const withHeader = useMemo(() => {
    if (question) {
      if (
        (question.type === QuestionType.BUZZER ||
          question.type === QuestionType.INPUT) &&
        (question.config as any)?.media === undefined
      )
        return showCorrect;
      return question.type !== QuestionType.NONE;
    } else {
      return false;
    }
  }, [question, showCorrect]);

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <main
      className="h-dvh w-dvw box-border px-4 pt-4 flex flex-col"
      style={{ fontFamily: "Unkempt, Love Ya Like A Sister, chalkduster" }}
    >
      <title>Show - Quiz</title>
      <BaseQuestionShow
        question={question}
        withHeader={withHeader}
        answerRevealed={showCorrect}
        answers={new Map()}
        playerReveals={new Map()}
      />
      <div className={"flex items-center w-full gap-3 h-1/10 mt-3"}>
        <Button
          className={"flex-1 text-5xl h-full"}
          onClick={() => setShowCorrect(!showCorrect)}
        >
          {showCorrect ? "Question" : "Answer"}
        </Button>
        <Button className={"flex-1 text-5xl h-full"} onClick={onBack}>
          Back
        </Button>
      </div>
    </main>
  );
}
