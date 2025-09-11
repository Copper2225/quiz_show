import TeamTile from "~/routes/show/components/TeamTile";
import { useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { useEventSource } from "remix-utils/sse/react";

const TeamsLine = () => {
  const fetcher = useFetcher<{ teams: Map<string, number> }>();
  const pointsEvent = useEventSource("/sse/events", {
    event: "pointsUpdate",
  });

  const loadPoints = useCallback(async () => {
    if (pointsEvent || !fetcher.data) {
      await fetcher.load("/api/teams");
    }
  }, [pointsEvent, fetcher]);

  useEffect(() => {
    loadPoints();
  }, [pointsEvent]);

  const teams = fetcher.data?.teams ?? [];

  return (
    <div
      className="grid gap-4 mt-10"
      style={{
        gridTemplateColumns: `repeat(${teams.keys.length}, minmax(0, 1fr))`,
        gridAutoFlow: "column dense",
      }}
    >
      {Array.from(teams).map(([name, points]) => (
        <TeamTile key={name} name={name} points={points} />
      ))}
    </div>
  );
};

export default TeamsLine;
