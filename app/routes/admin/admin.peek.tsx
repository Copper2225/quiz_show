import type { Route } from "./+types/admin.peek";
import { NavLink, redirect, useLoaderData } from "react-router";
import { prisma } from "~/utils/db.server";
import { QuestionType, type Question } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

export async function action({}: Route.ActionArgs) {
  return redirect("/admin");
}

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
  return { question };
}

export default function EditQuestion() {
  const { question } = useLoaderData<typeof loader>();
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const withHeader = useMemo(() => {
    if (question) {
      if (
        (question.type === QuestionType.BUZZER ||
          question.type === QuestionType.INPUT) &&
        (question.config as any)?.media === undefined
      )
        return answerRevealed;
      return question.type !== QuestionType.NONE;
    } else {
      return false;
    }
  }, [question, answerRevealed]);

  const triggerAnswer = useCallback(() => {
    setAnswerRevealed((prevState) => !prevState);
  }, []);

  return (
    <main className="h-dvh w-dvw box-border px-4 pt-4 flex flex-col">
      <NavLink to={"/admin"} className={"my-3 h-1/10 text-5xl"}>
        <Button className={"h-full w-full"}>
          <ArrowLeft /> Back
        </Button>
      </NavLink>
      <BaseQuestionShow
        question={question}
        withHeader={withHeader}
        answerRevealed={answerRevealed}
        answers={new Map()}
        playerReveals={new Map()}
      />
      <Button className={"my-3 h-1/10 text-5xl"} onClick={triggerAnswer}>
        Trigger Answer
      </Button>
    </main>
  );
}
