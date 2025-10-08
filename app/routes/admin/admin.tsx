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

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <title>Admin - Quiz</title>
      <div className={"h-full w-full box-border flex flex-col gap-4"}>
        <h1 className={"text-xl font-semibold"}>
          Admin - <Link to={"/show"}>Navigate to Show</Link>
        </h1>
        <QuestionSelect
          categories={data.config.categories}
          activeMatrix={data.activeMatrix}
          grid={data.questionGrid}
        />
        <Answers
          unlockOrLock={data.unlockOrLock}
          revealedOrHidden={data.answerRevealed}
          answers={data.answers}
          question={data.currentQuestion}
          userReveals={data.playerReveal}
          userLocks={data.userLocks}
          teams={data.teams}
          questionRevealTime={data.questionRevealTime}
        />
        <PointsSection
          points={data.currentQuestion?.points}
          teams={data.teams}
        />
      </div>
    </main>
  );
}
