import TeamTile from "~/routes/show/components/TeamTile";
import { useEffect, useMemo, useRef } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { type Question, QuestionType } from "~/types/question";
import { useRevalidator } from "react-router";
import { userColors } from "~/routes/show/userColors";
import type { JsonValue } from "@prisma/client/runtime/client";

interface Props {
  teams: Map<string, number>;
  answers: Map<string, { answer: string; time: string | Date }>;
  question: Question<JsonValue> | null;
  userReveals: Map<string, boolean>;
  questionRevealTime: Date | null;
}

const TeamsLine = ({
  teams,
  answers,
  question,
  userReveals,
  questionRevealTime,
}: Props) => {
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });
  const lockEvent = useEventSource("/sse/events", {
    event: "lockAnswers",
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    revalidate.revalidate();
  }, [
    answerUserEvent,
    clearEvent,
    answerTypeEvent,
    pointsEvent,
    userRevealEvent,
    lockEvent,
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

  const prevBuzzerTeamRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!prevBuzzerTeamRef.current && firstBuzzerTeam) {
      audioRef.current?.play();
    }
    prevBuzzerTeamRef.current = firstBuzzerTeam;
  }, [firstBuzzerTeam]);

  return (
    <div
      className="grid gap-4 mt-10"
      style={{
        gridTemplateColumns: `repeat(${Array.from(teams).length}, minmax(0, 1fr))`,
        gridAutoFlow: "column dense",
      }}
    >
      <audio ref={audioRef} src={"/buzzer.mp3"} muted={false} />
      {Array.from(teams).map(([name, points]) => (
        <TeamTile
          key={name}
          name={name}
          points={points}
          showAnswer={userReveals.get(name) ?? false}
          question={question}
          answer={(answers as Map<string, any>).get(name)}
          highlighted={
            question?.type === QuestionType.BUZZER && firstBuzzerTeam === name
          }
          questionRevealTime={questionRevealTime}
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
