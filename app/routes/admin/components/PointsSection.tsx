import { useFetcher } from "react-router";
import { useCallback, useEffect, useMemo } from "react";
import TeamPointTile from "~/routes/admin/components/TeamPointTile";
import { useEventSource } from "remix-utils/sse/react";

interface Props {
  points: number | undefined;
}

const PointsSection = ({ points }: Props) => {
  const pointsFetcher = useFetcher<{ teams: Map<string, number> }>();
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });

  const loadTeams = useCallback(async () => {
    await pointsFetcher.load("/api/teams");
  }, []);

  useEffect(() => {
    loadTeams();
  }, [pointsEvent]);

  const teams = useMemo(() => {
    return pointsFetcher.data?.teams ?? [];
  }, [pointsFetcher.data]);

  return (
    <div>
      {points && <span>Aktuelle Frage: {points} Punkte</span>}
      <div className={"flex flex-col gap-2"}>
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
