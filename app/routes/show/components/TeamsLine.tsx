import TeamTile from "~/routes/show/components/TeamTile";
import { useEffect, useMemo } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { type Question, QuestionType } from "~/types/question";
import { useRevalidator } from "react-router";
import { userColors } from "~/routes/show/userColors";

interface Props {
  teams: Map<string, number>;
  answers: Map<string, { answer: string; time: string | Date }>;
  question: Question<any> | null;
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
    if (!(question?.type === QuestionType.BUZZER)) return undefined;
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
          highlighted={
            question?.type === QuestionType.BUZZER && firstBuzzerTeam === name
          }
          color={
            question?.type === QuestionType.PIN
              ? userColors[Array.from(teams.keys()).indexOf(name)]
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default TeamsLine;
