import { useRevalidator } from "react-router";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import TeamPointTile from "~/routes/admin/components/TeamPointTile";
import { useEventSource } from "remix-utils/sse/react";
import { Input } from "~/components/ui/input";
import type { Question } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";

interface Props {
  teams: Map<string, number>;
  question: Question<JsonValue> | null;
}

const PointsSection = ({ question, teams }: Props) => {
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });
  const revalidate = useRevalidator();
  const [pointsChange, setPointsChange] = useState<number>(0);

  useEffect(() => {
    if (pointsEvent) {
      revalidate.revalidate().then();
    }
  }, [pointsEvent]);

  useEffect(() => {
    if (question) {
      setPointsChange(question.points);
    }
  }, [question?.points]);

  const handlePointsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^[0-9]+$/.test(inputValue)) {
      setPointsChange(Number(inputValue));
    }
  }, []);

  return (
    <div>
      <Input
        value={pointsChange}
        onChange={handlePointsChange}
        inputMode={"numeric"}
        pattern={'pattern="[0-9]*"'}
        className={"lg:text-2xl xl:text-3xl mb-2 w-32"}
      />
      <div
        className={
          "flex flex-col gap-2 min-h-[20dvh] max-h-[20dvh] overflow-y-scroll"
        }
      >
        {Array.from(teams).map(([name, userPoints]) => (
          <TeamPointTile
            name={name}
            points={userPoints}
            questionPoints={pointsChange}
            key={name}
          />
        ))}
      </div>
    </div>
  );
};

export default PointsSection;
