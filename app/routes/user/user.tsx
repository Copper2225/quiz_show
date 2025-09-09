import type { Route } from "./+types/user";
import { prisma } from "~/utils/db.server";
import Waiting from "~/routes/user/components/Waiting";
import { useLoaderData } from "react-router";
import { getUserNameFromRequest } from "~/utils/session.server";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo, useState } from "react";
import BuzzerField from "~/routes/user/components/BuzzerField";
import { getAnswerType, getIsUserLocked } from "~/utils/playData.server";
import MultipleChoiceField from "~/routes/user/components/MultipleChoiceField";

export async function loader({ request }: Route.LoaderArgs) {
  const userName = getUserNameFromRequest(request);
  if (!userName) {
    return new Response(null, { status: 302, headers: { Location: "/login" } });
  }
  const answerType = getAnswerType();
  const questions = await prisma.questionEntity.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  const isLocked = getIsUserLocked(userName);
  return { userName, questions, answerType, isLocked };
}

export default function user() {
  const answerTypeEvent = useEventSource("/sse/events", {
    event: "answerType",
  });
  const lockAnswersEvent = useEventSource("/sse/events", {
    event: "lockAnswers",
  });
  const data = useLoaderData<typeof loader>();
  const [questionData, setQuestionData] = useState<any>(data.answerType);

  useEffect(() => {
    if (answerTypeEvent !== null) {
      try {
        const payload = JSON.parse(answerTypeEvent) as { data: any };
        if (payload?.data) {
          setQuestionData(payload.data);
        }
      } catch {}
    }
  }, [answerTypeEvent]);

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
    switch (questionData?.type ?? "none") {
      case "buzzer":
        return <BuzzerField />;
      case "multipleChoice":
        return (
          <MultipleChoiceField locked={answersLocked} data={questionData} />
        );
      default:
        return <Waiting />;
    }
  }, [questionData, answersLocked]);

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <div className={"h-full w-full box-border flex flex-col gap-3"}>
        <h1 className={"w-full text-center"}>{data.userName}</h1>
        <div className={"flex-1 min-h-0"}>{renderAnswerComponents}</div>
      </div>
    </main>
  );
}
