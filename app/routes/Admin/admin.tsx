import { useFetcher, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useState } from "react";
import QuestionSelect from "~/routes/Admin/components/QuestionSelect";
import { getConfig } from "~/utils/config.server";
import {
  getActiveMatrix,
  initActiveMatrix,
  isAnyLocked,
} from "~/utils/playData.server";

export async function loader() {
  const config = getConfig();
  let activeMatrix = getActiveMatrix();
  if (!activeMatrix) {
    activeMatrix = initActiveMatrix(
      config.categories.length,
      config.questionDepth,
    );
  }
  const unlockOrLock = isAnyLocked();
  return { config, activeMatrix, unlockOrLock };
}

export default function Admin() {
  const data = useLoaderData<typeof loader>();
  const answerEvent = useEventSource("/sse/events/admin", { event: "answer" });
  const [answers, setAnswers] = useState<
    Map<string, { answer: string; time: string }>
  >(new Map());
  const [locked, setLocked] = useState<boolean>(data.unlockOrLock);

  const lockAnswersFetcher = useFetcher();

  useEffect(() => {
    if (answerEvent !== null) {
      try {
        const payload = JSON.parse(answerEvent);
        const newAnswers = new Map(answers);
        newAnswers.set(payload.from, {
          answer: payload.data.answer,
          time: payload.data.time,
        });
        setAnswers(newAnswers);
      } catch {}
    }
  }, [answerEvent]);

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <div className={"h-full w-full box-border flex flex-col gap-4"}>
        <h1 className={"text-xl font-semibold"}>Admin</h1>
        <QuestionSelect
          categories={data.config.categories}
          questions={data.config.questionDepth}
          activeMatrix={data.activeMatrix}
        />
        <ul className={"h-1/8"}>
          {Array.from(answers.entries()).map(([key, value]) => (
            <li key={key}>
              {key}: {value.answer} ({value.time})
            </li>
          ))}
        </ul>
        <lockAnswersFetcher.Form
          method={"post"}
          action={"/api/lockAnswers"}
          onSubmit={() => setLocked((prevState) => !prevState)}
        >
          <input hidden readOnly value={"true"} name={"setAll"} />
          <input
            hidden
            readOnly
            value={locked ? "false" : "true"}
            name={"locked"}
          />
          <Button>{locked ? "Unlock Answers" : "Lock Answers"}</Button>
        </lockAnswersFetcher.Form>
      </div>
    </main>
  );
}
