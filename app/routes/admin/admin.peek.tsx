import type { Route } from "./+types/admin.peek";
import { NavLink, redirect, useLoaderData } from "react-router";
import { prisma } from "~/utils/db.server";
import { QuestionType, type Question } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import BaseQuestionShow from "~/routes/show/components/QuestionTypes/BaseQuestionShow";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AdminData } from "~/utils/playData.server";

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

  const { config, activeMatrix, questionGrid } = AdminData;
  return {
    question,
    activeMatrix,
    categories: config.categories,
    grid: questionGrid,
  };
}

export default function EditQuestion() {
  const { question, activeMatrix, categories, grid } =
    useLoaderData<typeof loader>();
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [open, setOpen] = useState(false);

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
      <div className={"flex gap-3 mb-3"}>
        <NavLink
          to={"/admin"}
          className={
            "flex flex-1 h-full bg-primary rounded-lg justify-center items-center"
          }
        >
          <ArrowLeft /> Back
        </NavLink>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className={"flex-1 h-full lg:text-2xl xl:text-3xl"}>
              OPEN
            </Button>
          </DialogTrigger>
          <DialogContent className={"sm:max-w-[90%] sm:max-h-[80%]"}>
            <DialogHeader>
              <DialogTitle>Select Question</DialogTitle>
            </DialogHeader>
            <div
              className="grid gap-4 w-full flex-1"
              style={{
                gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${activeMatrix[0]?.length + 1}, minmax(0, 1fr))`,
                gridAutoFlow: "column dense",
              }}
            >
              {categories.map((cate, colIndex) => {
                return (
                  <Fragment key={colIndex}>
                    <Button
                      variant={"outline"}
                      className={`w-full overflow-hidden whitespace-break-spaces xl:text-3xl h-full flex items-center justify-center border-2 !border-primary`}
                    >
                      {cate}
                    </Button>
                    {Array.from(
                      { length: activeMatrix[0]?.length },
                      (_, rowIndex) => (
                        <NavLink to={`/admin/peek/${colIndex}/${rowIndex}`}>
                          <Button
                            className={`flex-1 md:text-3xl xl:text-4xl w-full h-full flex items-center justify-center ${!activeMatrix[colIndex][rowIndex] && "opacity-40"}`}
                            type={"submit"}
                            onClick={() => {
                              setOpen(false);
                              setAnswerRevealed(false);
                            }}
                          >
                            {grid.get(`${colIndex}:${rowIndex}`)?.points ??
                              (rowIndex + 1) * 100}
                          </Button>
                        </NavLink>
                      ),
                    )}
                  </Fragment>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
