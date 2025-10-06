import type { Route } from "./+types/user";
import Waiting from "~/routes/user/components/Waiting";
import { useLoaderData, useRevalidator } from "react-router";
import { getUserNameFromRequest } from "~/utils/session.server";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo, useState } from "react";
import BuzzerField from "~/routes/user/components/BuzzerField";
import { getUserData, playerData } from "~/utils/playData.server";
import MultipleChoiceField from "~/routes/user/components/MultipleChoiceField";
import InputAnswerField from "~/routes/user/components/InputAnswerField";
import OrderField from "~/routes/user/components/OrderField";
import type {
  UserMultipleChoiceQuestion,
  UserOrderQuestion,
  UserPinQuestion,
} from "~/types/userTypes";
import PinField from "~/routes/user/components/PinField";
import { QuestionType } from "~/types/question";

export async function loader({ request }: Route.LoaderArgs) {
  const userName = await getUserNameFromRequest(request);
  if (!userName) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }
  return { ...playerData, ...getUserData(userName) };
}

export default function user() {
  const answerTypeEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const lockAnswersEvent = useEventSource("/sse/events", {
    event: "lockAnswers",
  });
  const data = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    revalidator.revalidate();
  }, [answerTypeEvent, lockAnswersEvent]);

  const [answersLocked, setAnswersLocked] = useState<boolean>(
    data.isLocked ?? false,
  );

  useEffect(() => {
    if (lockAnswersEvent !== null) {
      try {
        const payload = JSON.parse(lockAnswersEvent) as {
          all: boolean | undefined;
          user: string | undefined;
          locked: boolean;
        };
        if (payload.all || payload.user === data.userName) {
          setAnswersLocked(payload.locked);
        }
      } catch {}
    }
  }, [lockAnswersEvent, setAnswersLocked]);

  const renderAnswerComponents = useMemo(() => {
    if (data.question) {
      switch (data.question?.type ?? "none") {
        case QuestionType.BUZZER:
          return <BuzzerField isLocked={data.isLocked} />;
        case QuestionType.MULTIPLE_CHOICE:
          return (
            <MultipleChoiceField
              locked={answersLocked}
              data={data.question as UserMultipleChoiceQuestion}
            />
          );
        case QuestionType.INPUT:
          return (
            <InputAnswerField
              answer={data.answer?.answer}
              locked={answersLocked}
            />
          );
        case QuestionType.ORDER:
          return (
            <OrderField
              locked={answersLocked}
              data={data.question as UserOrderQuestion}
              answer={data.answer?.answer}
            />
          );
        case QuestionType.PIN:
          return (
            <PinField
              locked={answersLocked}
              data={data.question as UserPinQuestion}
              answer={data.answer?.answer}
              teamColor={data.userColor}
            />
          );
        default:
          return <Waiting />;
      }
    } else {
      return <Waiting />;
    }
  }, [data.question, answersLocked, data.answer]);

  return (
    <main className={"max-h-dvh h-dvh w-dvw box-border p-2"}>
      <div className={"h-full w-full box-border flex flex-col gap-3"}>
        <h1 className={"w-full text-center"}>{data.userName}</h1>
        <div className={"h-full min-h-0"}>{renderAnswerComponents}</div>
      </div>
    </main>
  );
}
