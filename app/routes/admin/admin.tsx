import { useLoaderData } from "react-router";
import QuestionSelect from "~/routes/admin/components/QuestionSelect";
import { getConfig, getQuestionsGrid } from "~/utils/config.server";
import {
  answerRevealed,
  getActiveMatrix,
  getAnswers,
  getQuestion,
  initActiveMatrix,
  isAnyLocked,
} from "~/utils/playData.server";
import PointsSection from "~/routes/admin/components/PointsSection";
import Answers from "~/routes/admin/components/Answers";

export async function loader() {
  const config = getConfig();
  let activeMatrix = getActiveMatrix();
  const grid = await getQuestionsGrid();

  if (
    activeMatrix.length !== config.categories.length ||
    activeMatrix[0]?.length !== config.questionDepth
  ) {
    activeMatrix = initActiveMatrix(
      config.categories.length,
      config.questionDepth,
    );
  }
  const unlockOrLock = isAnyLocked();
  const question = getQuestion();
  const answers = getAnswers();
  const revealed = answerRevealed;
  return {
    config,
    activeMatrix,
    unlockOrLock,
    question,
    grid,
    answers,
    revealed,
  };
}

export default function Admin() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <div className={"h-full w-full box-border flex flex-col gap-4"}>
        <h1 className={"text-xl font-semibold"}>Admin</h1>
        <QuestionSelect
          categories={data.config.categories}
          activeMatrix={data.activeMatrix}
          grid={data.grid}
        />
        <Answers
          unlockOrLock={data.unlockOrLock}
          revealedOrHidden={data.revealed}
          dataAnswers={data.answers}
          question={data.question}
        />
        <PointsSection points={data.question?.points} />
      </div>
    </main>
  );
}
