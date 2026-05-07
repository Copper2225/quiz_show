import { Link, useLoaderData } from "react-router";
import QuestionSelect from "~/routes/admin/components/QuestionSelect";
import { getConfig, initQuestionGrid } from "~/utils/config.server";
import {
  AdminData,
  initActiveMatrix,
  isAnyLocked,
} from "~/utils/playData.server";
import PointsSection from "~/routes/admin/components/PointsSection";
import Answers from "~/routes/admin/components/Answers";
import ShowCurrent from "~/routes/admin/components/ShowCurrent";
import { Button } from "~/components/ui/button";
import { Power, PowerOff, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import Select from "~/components/Select";
import { QLCConnection } from "~/components/QLCConnection";
import {
  isConnected,
  vcWidgetSetValue,
} from "~/utils/qlc.client";

export async function loader() {
  const config = getConfig();
  let activeMatrix = AdminData.activeMatrix;
  if (
    activeMatrix.length !== config.categories.length ||
    activeMatrix[0]?.length !== config.questionDepth
  ) {
    initActiveMatrix(config.categories.length, config.questionDepth);
    await initQuestionGrid();
  }
  return { ...AdminData, unlockOrLock: isAnyLocked() };
}

export default function Admin() {
  const data = useLoaderData<typeof loader>();
  const [isTriggering, setIsTriggering] = useState(false);
  const [qlcWidgetId, setQlcWidgetId] = useState("122");
  const [qlcValue, setQlcValue] = useState("255");
  const [qlcConnected, setQlcConnected] = useState(false);
  const [widgets, setWidgets] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    setQlcConnected(isConnected());
  }, []);

  const handleWidgetsUpdate = useCallback((newWidgets: { value: string; label: string }[]) => {
    setWidgets(newWidgets);
    if (newWidgets.length > 0 && !newWidgets.find(w => w.value === qlcWidgetId)) {
      setQlcWidgetId(newWidgets[0].value);
    }
  }, [qlcWidgetId]);

  const triggerQLC = useCallback(async () => {
    if (!isConnected()) {
      toast.error("Not connected to QLC+");
      setQlcConnected(false);
      return;
    }
    setIsTriggering(true);
    try {
      vcWidgetSetValue(qlcWidgetId, qlcValue);
      toast.success("QLC Triggered");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to trigger QLC",
      );
    } finally {
      setIsTriggering(false);
    }
  }, [qlcWidgetId, qlcValue]);

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <title>Admin - Quiz</title>
      <div className={"h-full w-full box-border flex flex-col gap-4"}>
        <div className={"flex justify-between"}>
          <div className={"flex gap-4 items-center"}>
            <h1 className={"text-xl font-semibold"}>
              Admin - <Link to={"/show"}>Zur Show springen</Link>
            </h1>
            <QLCConnection onWidgetsUpdate={handleWidgetsUpdate} />
          </div>
          <ShowCurrent
            teamNames={Array.from(data.teams.keys())}
            currentTeam={data.currentSelector}
            showCurrentSelector={data.showCurrentSelector}
          />
        </div>
        <div>
          <QuestionSelect
            categories={data.config.categories}
            activeMatrix={data.activeMatrix}
            grid={data.questionGrid}
          />
        </div>
        <Answers
          unlockOrLock={data.unlockOrLock}
          revealedOrHidden={data.answerRevealed}
          answers={data.answers}
          question={data.currentQuestion}
          userReveals={data.playerReveal}
          userLocks={data.userLocks}
          teams={data.teams}
          questionRevealTime={data.questionRevealTime}
          userShowHints={data.userHints}
        />
        <PointsSection
          points={data.currentQuestion?.points}
          teams={data.teams}
        />
      </div>
    </main>
  );
}
