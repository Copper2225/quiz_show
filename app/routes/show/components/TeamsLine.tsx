import TeamTile from "~/routes/show/components/TeamTile";
import { useEffect, useMemo, useRef } from "react";
import { type Question, QuestionType } from "~/types/question";
import { userColors } from "~/routes/show/userColors";
import type { JsonValue } from "@prisma/client/runtime/client";
import type { HigherLowerQuestion } from "~/types/adminTypes";

interface Props {
  teams: Map<string, number>;
  answers: Map<string, { answer: string; time: string | Date }>;
  question: Question<JsonValue> | null;
  userReveals: Map<string, boolean>;
  questionRevealTime: Date | null;
  showSelector: boolean;
  currentSelector: number;
}

const PLAY_SOUND = false;

const TeamsLine = ({
  teams,
  answers,
  question,
  userReveals,
  questionRevealTime,
  showSelector,
  currentSelector,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!prevBuzzerTeamRef.current && firstBuzzerTeam && PLAY_SOUND) {
      audioRef.current?.play();
    }
    prevBuzzerTeamRef.current = firstBuzzerTeam;
  }, [firstBuzzerTeam, PLAY_SOUND]);

  const teamPositions = useMemo(() => {
    if (question?.type !== QuestionType.HIGHER_LOWER) return new Map();

    const teamLosingTime = Array.from(teams.keys()).map((name) => {
      const answer = answers.get(name);
      const hearts = answer?.answer?.replace(/[^♥︎❤]/g, "") ?? "";
      return {
        name,
        heartsCount: hearts.length,
        time: answer?.time ? new Date(answer.time).getTime() : 0,
      };
    });

    const outOfHeartsTeams = teamLosingTime
      .filter((t) => t.heartsCount === 0)
      .sort((a, b) => a.time - b.time);

    const positions = new Map<string, string>();
    const totalTeams = teams.size;

    outOfHeartsTeams.forEach((team, index) => {
      const rank = totalTeams - index;
      let suffix = ".";
      if (rank === 1) suffix = "st";
      else if (rank === 2) suffix = "nd";
      else if (rank === 3) suffix = "rd";
      positions.set(team.name, `${rank}${rank > 3 ? "." : suffix}`);
    });

    return positions;
  }, [answers, question?.type, teams]);

  return (
    <div
      className="grid gap-4 mt-10"
      style={{
        gridTemplateColumns: `repeat(${Array.from(teams).length}, minmax(0, 1fr))`,
        gridAutoFlow: "column dense",
      }}
    >
      <audio ref={audioRef} src={"/buzzer.mp3"} muted={false} />
      {Array.from(teams).map(([name, points], index) => (
        <TeamTile
          key={name}
          name={name}
          points={points}
          showAnswer={userReveals.get(name) ?? false}
          question={question}
          answer={(answers as Map<string, any>).get(name)}
          position={teamPositions.get(name)}
          highlighted={
            (question?.type === QuestionType.BUZZER &&
              firstBuzzerTeam === name) ||
            (!question && showSelector && currentSelector === index) ||
            (question?.type === QuestionType.HIGHER_LOWER &&
              (question as HigherLowerQuestion).config.selector === index)
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
