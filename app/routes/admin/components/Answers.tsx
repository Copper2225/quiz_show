import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useEventSource } from "remix-utils/sse/react";

interface Props {
  unlockOrLock: boolean;
  dataAnswers: Map<string, { answer: string; time: Date }>;
}

const Answers = ({ unlockOrLock, dataAnswers }: Props) => {
  const [locked, setLocked] = useState<boolean>(unlockOrLock);

  const answersFetcher = useFetcher();

  const clearEvent = useEventSource("/sse/events", { event: "clearAnswers" });
  const answerEvent = useEventSource("/sse/events/admin", { event: "answer" });
  const [answers, setAnswers] =
    useState<Map<string, { answer: string; time: Date }>>(dataAnswers);

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

  useEffect(() => {
    if (clearEvent !== null) {
      try {
        setAnswers(new Map());
      } catch {}
    }
  }, [clearEvent]);

  const clearAnswers = useCallback(() => {
    answersFetcher.submit("clear", {
      method: "post",
      action: "/api/clearAnswers",
    });
  }, []);

  return (
    <>
      <ul className={"h-1/8"}>
        {Array.from(answers.entries()).map(([key, value]) => (
          <li key={key}>
            {key}: {value.answer} –– {format(value.time, "HH:mm:ss:SSS", {})}
          </li>
        ))}
      </ul>
      <answersFetcher.Form
        method={"post"}
        action={"/api/lockAnswers"}
        onSubmit={() => setLocked((prevState) => !prevState)}
        className={"flex flex-col"}
      >
        <input hidden readOnly value={"true"} name={"setAll"} />
        <input
          hidden
          readOnly
          value={locked ? "false" : "true"}
          name={"locked"}
        />
        <Button>{locked ? "Unlock Answers" : "Lock Answers"}</Button>
      </answersFetcher.Form>
      <Button onClick={clearAnswers}>Clear answers</Button>
    </>
  );
};

export default Answers;
