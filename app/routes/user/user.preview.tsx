import type { Route } from "./+types/user.preview";
import Waiting from "~/routes/user/components/Waiting";
import { useLoaderData, useRevalidator } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo } from "react";
import BuzzerField from "~/routes/user/components/BuzzerField";
import { AdminData } from "~/utils/playData.server";
import MultipleChoiceField from "~/routes/user/components/MultipleChoiceField";
import InputAnswerField from "~/routes/user/components/InputAnswerField";
import OrderField from "~/routes/user/components/OrderField";
import type {
  UserMultipleChoiceQuestion,
  UserOrderQuestion,
  UserPinQuestion,
} from "~/types/userTypes";
import PinField from "~/routes/user/components/PinField";
import { type Question, QuestionType } from "~/types/question";
import { prisma } from "~/utils/db.server";
import type { JsonValue } from "@prisma/client/runtime/client";
import { userColors } from "~/routes/show/userColors";

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

export default function user() {
  const answerTypeEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const lockAnswersEvent = useEventSource("/sse/events", {
    event: "lockAnswers",
  });
  const { question } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    revalidator.revalidate();
  }, [answerTypeEvent, lockAnswersEvent]);

  const renderAnswerComponents = useMemo(() => {
    if (question) {
      switch (question?.type ?? "none") {
        case QuestionType.BUZZER:
          return <BuzzerField isLocked={false} />;
        case QuestionType.MULTIPLE_CHOICE:
          return (
            <MultipleChoiceField
              locked={false}
              data={question as UserMultipleChoiceQuestion}
            />
          );
        case QuestionType.INPUT:
          return <InputAnswerField locked={false} />;
        case QuestionType.ORDER:
          return (
            <OrderField
              locked={false}
              data={question as UserOrderQuestion}
              answer={undefined}
            />
          );
        case QuestionType.PIN:
          return (
            <PinField
              locked={false}
              data={question as UserPinQuestion}
              answer={undefined}
              teamColor={userColors[0]}
            />
          );
        default:
          return <Waiting />;
      }
    } else {
      return <Waiting />;
    }
  }, [question]);

  return (
    <main className={"max-h-dvh h-dvh w-dvw box-border p-2"}>
      <div className={"h-full w-full box-border flex flex-col gap-3"}>
        <h1 className={"w-full text-center"}>Test Name</h1>
        <div className={"h-full min-h-0"}>{renderAnswerComponents}</div>
      </div>
    </main>
  );
}
