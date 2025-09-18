import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/edit";

import {
  type Config,
  getConfig,
  addCategory,
  addQuestionDepth,
  setCategory,
  getQuestionsGrid,
} from "~/utils/config.server";
import { Link, useFetcher, useLoaderData } from "react-router";

type LoaderData = {
  config: Config;
  questions: Map<string, any>;
};

export async function loader({}: Route.LoaderArgs) {
  const config = getConfig();
  const questions = await getQuestionsGrid();
  return { config, questions };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "addCategory") {
    addCategory();
  } else if (intent === "addQuestionDepth") {
    addQuestionDepth();
  } else if (intent === "setCategory") {
    const categoryName = formData.get("categoryName") as string;
    const index = formData.get("index") as string;
    setCategory(categoryName, Number(index));
  }

  return { config: getConfig() };
}

export default function Edit() {
  const data = useLoaderData<LoaderData>();
  const headers = data.config.categories.map((cate) => cate);
  const depth = data.config.questionDepth;
  const addCategoryFetcher = useFetcher();
  const addDepthFetcher = useFetcher();
  const setCategoryFetcher = useFetcher();

  return (
    <main>
      <div className="h-dvh w-dvw box-border p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Points Grid</h1>

        <div className={"h-full flex w-full"}>
          <div className={"w-full h-full flex flex-col"}>
            <div
              className="grid gap-4 mb-4"
              style={{
                gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
              }}
            >
              {headers.map((header, i) => (
                <setCategoryFetcher.Form method={"post"} key={i}>
                  <Input
                    className="text-lg"
                    name={"categoryName"}
                    defaultValue={header}
                    onBlur={(e) => {
                      setCategoryFetcher.submit(
                        {
                          intent: "setCategory",
                          index: String(i),
                          categoryName: e.currentTarget.value,
                        },
                        { method: "post" },
                      );
                    }}
                  />
                </setCategoryFetcher.Form>
              ))}
            </div>

            {/* Grid with right "+" */}
            <div className="flex flex-1 items-stretch">
              <div
                className="grid gap-4 h-full flex-1"
                style={{
                  gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${depth}, minmax(0, 1fr))`,
                  gridAutoFlow: "column dense",
                }}
              >
                {data.config.categories.map((_cate, colIndex) =>
                  Array.from({ length: depth }, (_, rowIndex) => (
                    <Link
                      key={`${colIndex}-${rowIndex}`}
                      to={"/edit/" + colIndex + "/" + rowIndex}
                    >
                      <Button
                        variant={"outline"}
                        className={`w-full text-5xl h-full flex items-center justify-center ${data.questions.get(colIndex + ":" + rowIndex) ? "!border-emerald-500" : "!border-red-400"}`}
                      >
                        {data.questions.get(colIndex + ":" + rowIndex)
                          ?.points ?? (rowIndex + 1) * 100}
                      </Button>
                    </Link>
                  )),
                )}
              </div>
            </div>
          </div>
          {/* "+" button at the right (beside grid, fills all rows) */}
          <div className="ml-4 h-full self-end">
            <addCategoryFetcher.Form method="post" className="h-full">
              <input type="hidden" name="intent" value="addCategory" />
              <Button
                type="submit"
                className="h-full text-5xl flex items-center justify-center"
              >
                +
              </Button>
            </addCategoryFetcher.Form>
          </div>
        </div>

        {/* "+" button at the bottom (fills all columns) */}
        <div className="mt-4">
          <addDepthFetcher.Form method="post" className="w-full">
            <input type="hidden" name="intent" value="addQuestionDepth" />
            <Button
              type="submit"
              className="w-full h-full text-5xl flex items-center justify-center"
            >
              +
            </Button>
          </addDepthFetcher.Form>
        </div>
      </div>
    </main>
  );
}
