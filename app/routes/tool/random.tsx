import { type FC, useCallback } from "react";
import { QLCConnection } from "~/components/QLCConnection";
import { Button } from "~/components/ui/button";
import { executeQLCCommand } from "~/utils/qlc.client";
import { ShowData } from "~/utils/playData.server";
import { useLoaderData } from "react-router";
import { RotateCw } from "lucide-react";

export async function loader() {
  return {
    teamNumber: 4,
    qlcConfigs: Object.fromEntries(ShowData.qlcConfigs),
  };
}

const Random: FC = () => {
  const { qlcConfigs, teamNumber } = useLoaderData<typeof loader>();

  const handleRandomTeam = useCallback(async () => {
    const finalTeam = Math.floor(Math.random() * teamNumber) + 1;
    const extraSteps = 20; // Mindestanzahl für den Effekt
    const totalSteps = extraSteps + finalTeam;

    for (let i = 0; i < totalSteps; i++) {
      const currentTeam = (i % teamNumber) + 1;
      executeQLCCommand(`active-t${currentTeam};255`, qlcConfigs);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }, [qlcConfigs, teamNumber]);

  const handleReset = useCallback(() => {
    executeQLCCommand("active-no-selector;255", qlcConfigs);
  }, [qlcConfigs]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <QLCConnection />
      <div className={"flex gap-3"}>
        <Button className={"flex-1"} onClick={handleRandomTeam}>Random Team</Button>
        <Button onClick={handleReset}><RotateCw /></Button>
      </div>
    </div>
  );
};

export default Random;