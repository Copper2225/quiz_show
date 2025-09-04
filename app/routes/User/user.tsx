import type { Route } from "./+types/user";
import { prisma } from "~/utils/db.server";
import Waiting from "~/routes/User/components/Waiting";
import { useLoaderData } from "react-router";
import { getUserNameFromRequest } from "~/utils/session.server";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useMemo, useState } from "react";
import BuzzerField from "~/routes/User/components/BuzzerField";
import { getAnswerType } from "~/utils/playData";

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
  return { userName, questions, answerType };
}

export default function User() {
  const event = useEventSource("/sse/events", { event: "answerType" });
  const data = useLoaderData<typeof loader>();
  const [answerType, setAnswerType] = useState<string | null>(data.answerType);

  useEffect(() => {
    if (event !== null) {
      try {
        const payload = JSON.parse(event) as { data: any };

        if (payload?.data) {
          setAnswerType(payload.data.type);
        }
      } catch {}
    }
  }, [event]);

  const renderAnswerComponents = useMemo(() => {
    switch (answerType) {
      case "buzzer":
        return <BuzzerField />;
      default:
        return <Waiting />;
    }
  }, [answerType]);

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <div className={"h-full w-full box-border flex flex-col gap-3"}>
        <h1 className={"w-full text-center"}>{data.userName}</h1>
        <div className={"flex-1 min-h-0"}>{renderAnswerComponents}</div>
      </div>
    </main>
  );
}
