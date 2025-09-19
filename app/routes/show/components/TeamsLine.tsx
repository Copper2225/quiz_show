import TeamTile from "~/routes/show/components/TeamTile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import { useEventSource } from "remix-utils/sse/react";

const TeamsLine = () => {
  const fetcher = useFetcher<{ teams: Map<string, number> }>();
  const answersFetcher = useFetcher<{
    answers: Map<string, { answer: string; time: string | Date }>;
  }>();
  const questionFetcher = useFetcher<any>();
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });
  const answerUserEvent = useEventSource("/sse/events/admin", {
    event: "answer",
  });
  const clearEvent = useEventSource("/sse/events", { event: "clearAnswers" });
  const answerTypeEvent = useEventSource("/sse/events", {
    event: "answerType",
  });

  const [isBuzzer, setIsBuzzer] = useState<boolean>(false);

  const loadPoints = useCallback(async () => {
    if (pointsEvent || !fetcher.data) {
      await fetcher.load("/api/teams");
    }
  }, [pointsEvent, fetcher]);

  const loadAnswers = useCallback(async () => {
    if (answerUserEvent || clearEvent || !answersFetcher.data) {
      await answersFetcher.load("/api/answers");
    }
  }, [answerUserEvent, clearEvent, answersFetcher]);

  useEffect(() => {
    loadPoints();
  }, [pointsEvent]);

  useEffect(() => {
    loadAnswers();
  }, [answerUserEvent, clearEvent]);

  useEffect(() => {
    if (!fetcher.data) fetcher.load("/api/teams");
    if (!answersFetcher.data) answersFetcher.load("/api/answers");
    if (!questionFetcher.data) questionFetcher.load("/api/question");
  }, []);

  useEffect(() => {
    if (answerTypeEvent !== null) {
      try {
        const payload = JSON.parse(answerTypeEvent) as { data?: any };
        setIsBuzzer(payload?.data?.type === "buzzer");
      } catch {}
    }
  }, [answerTypeEvent]);

  useEffect(() => {
    const q = questionFetcher.data?.question;
    if (q) {
      setIsBuzzer(q.type === "buzzer");
    } else if (q === null) {
      setIsBuzzer(false);
    }
  }, [questionFetcher.data]);

  const teams = fetcher.data?.teams ?? [];
  const answers = answersFetcher.data?.answers ?? new Map();

  const firstBuzzerTeam = useMemo(() => {
    if (!isBuzzer) return undefined;
    let first: { name: string; time: string | Date } | undefined;
    for (const [name, value] of Array.from(answers.entries())) {
      const currentTime = value.time as any;
      if (!first || (currentTime as any) < (first.time as any)) {
        first = { name, time: currentTime };
      }
    }
    return first?.name;
  }, [answers, isBuzzer]);

  return (
    <div
      className="grid gap-4 mt-10"
      style={{
        gridTemplateColumns: `repeat(${Array.from(teams).length}, minmax(0, 1fr))`,
        gridAutoFlow: "column dense",
      }}
    >
      {Array.from(teams).map(([name, points]) => (
        <TeamTile
          key={name}
          name={name}
          points={points}
          showAnswer={!isBuzzer}
          answer={(answers as Map<string, any>).get(name)?.answer}
          highlighted={isBuzzer && firstBuzzerTeam === name}
        />
      ))}
    </div>
  );
};

export default TeamsLine;
