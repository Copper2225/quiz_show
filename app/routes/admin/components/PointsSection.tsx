import { useRevalidator } from "react-router";
import { useEffect } from "react";
import TeamPointTile from "~/routes/admin/components/TeamPointTile";
import { useEventSource } from "remix-utils/sse/react";

interface Props {
  points: number | undefined;
  teams: Map<string, number>;
}

const PointsSection = ({ points, teams }: Props) => {
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });
  const revalidate = useRevalidator();

  useEffect(() => {
    if (pointsEvent) {
      revalidate.revalidate().then();
    }
  }, [pointsEvent]);

  return (
    <div>
      {points && <span>Aktuelle Frage: {points} Punkte</span>}
      <div
        className={
          "flex flex-col gap-2 min-h-[20dvh] max-h-[20dvh] overflow-y-scroll"
        }
      >
        {Array.from(teams).map(([name, userPoints]) => (
          <TeamPointTile
            name={name}
            points={userPoints}
            questionPoints={points}
            key={name}
          />
        ))}
      </div>
    </div>
  );
};

export default PointsSection;
