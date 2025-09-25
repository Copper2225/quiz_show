import TeamTile from "~/routes/show/components/TeamTile";
import { useEffect, useMemo } from "react";
import { useEventSource } from "remix-utils/sse/react";
import type { QuestionEntity } from "@prisma/client";
import { useRevalidator } from "react-router";

interface Props {
  teams: Map<string, number>;
  answers: Map<string, { answer: string; time: string | Date }>;
  question: QuestionEntity | null;
  userReveals: Map<string, boolean>;
}

const TeamsLine = ({ teams, answers, question, userReveals }: Props) => {
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
  const userRevealEvent = useEventSource("/sse/events", {
    event: "revealUser",
  });
  const revalidate = useRevalidator();

  useEffect(() => {
    revalidate.revalidate();
  }, [
    answerUserEvent,
    clearEvent,
    answerTypeEvent,
    pointsEvent,
    userRevealEvent,
  ]);

  const firstBuzzerTeam = useMemo(() => {
    if (!(question?.type === "buzzer")) return undefined;
    let first: { name: string; time: string | Date } | undefined;
    for (const [name, value] of Array.from(answers.entries())) {
      const currentTime = value.time as any;
      if (!first || (currentTime as any) < (first.time as any)) {
        first = { name, time: currentTime };
      }
    }
    return first?.name;
  }, [answers, question?.type]);

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
          showAnswer={userReveals.get(name) ?? false}
          answer={(answers as Map<string, any>).get(name)?.answer}
          highlighted={question?.type === "buzzer" && firstBuzzerTeam === name}
        />
      ))}
    </div>
  );
};

export default TeamsLine;
