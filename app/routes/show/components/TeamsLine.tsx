import TeamTile from "~/routes/Show/components/TeamTile";
import { useEffect } from "react";
import { useFetcher } from "react-router";

const TeamsLine = () => {
  const fetcher = useFetcher<{ teams: Map<string, number> }>();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/api/team-names");
    }
  }, [fetcher]);

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
