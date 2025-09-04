import type { Route } from "./+types/show";
import { useLoaderData } from "react-router";
import { getConfig } from "~/utils/config.server";
import PointsGrid from "~/routes/Show/components/PointsGrid";
import {
  getActiveMatrix,
  initActiveMatrix,
  toggleActiveMatrix,
} from "~/utils/playData";
import TeamsLine from "~/routes/Show/components/TeamsLine";

export async function loader() {
  const config = getConfig();
  let activeMatrix = getActiveMatrix();
  if (!activeMatrix) {
    activeMatrix = initActiveMatrix(
      config.categories.length,
      config.questionDepth,
    );
  }
  return { config, activeMatrix };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const rawConfig = formData.get("data") as string;
  const config = JSON.parse(rawConfig) as { col: number; row: number };

  toggleActiveMatrix(config.col, config.row);
}

export default function Show() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="h-dvh w-dvw box-border px-4 pt-4 flex flex-col">
      <PointsGrid
        categories={data.config.categories}
        questions={data.config.questionDepth}
        activeMatrix={data.activeMatrix}
      />
      <TeamsLine />
    </main>
  );
}
