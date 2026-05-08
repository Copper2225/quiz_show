import type { Route } from "./+types/teams";
import { AdminData, setTeamPoints } from "~/utils/playData.server";
import dot from "dot-object";
import { broadcast } from "~/routes/events/sse.events";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.kick === "true") {
    AdminData.teams.delete(requestValues.name);
  } else if (requestValues.teams) {
    (JSON.parse(requestValues.teams) as string[]).forEach((team) => {
      setTeamPoints(
        team,
        (AdminData.teams.get(team) ?? 0) + Number(requestValues.points),
      );
    });
  } else {
    setTeamPoints(requestValues.name, Number(requestValues.points));
  }

  const commands: string[] = [];
  if (Number(requestValues.points) > 0) {
    const teamNames = Array.from(AdminData.teams.keys());
    if (requestValues.teams) {
      (JSON.parse(requestValues.teams) as string[]).forEach((teamName) => {
        const teamIndex = teamNames.indexOf(teamName);
        if (teamIndex !== -1) {
          commands.push(`correct-t${teamIndex + 1}`);
        }
      });
    } else if (requestValues.name) {
      const teamIndex = teamNames.indexOf(requestValues.name);
      if (teamIndex !== -1) {
        commands.push(`correct-t${teamIndex + 1}`);
      }
    }
  }

  broadcast("pointsUpdate", { ...requestValues, command: commands });
}
