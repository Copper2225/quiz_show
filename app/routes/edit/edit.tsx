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
  initQuestionGrid,
} from "~/utils/config.server";
import {
  Link,
  NavLink,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from "react-router";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Trash, Tv, UserRoundSearch } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";

type LoaderData = {
  config: Config;
  questions: Map<string, any>;
};

export async function loader({}: Route.LoaderArgs) {
  const config = getConfig();
  await initQuestionGrid();
  const questions = getQuestionsGrid();
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
    await setCategory(categoryName, Number(index));
  }

  return { config: getConfig() };
}

export default function Edit() {
  const data = useLoaderData<LoaderData>();
  const headers = data.config.categories.map((cate) => cate);
  const depth = data.config.questionDepth;
  const deleteEvent = useEventSource("/sse/events/admin", {
    event: "deleteQuestion",
  });
  const addCategoryFetcher = useFetcher();
  const addDepthFetcher = useFetcher();
  const setCategoryFetcher = useFetcher();
  const revalidator = useRevalidator();

  const deleteFetcher = useFetcher();

  const deleteQuestion = useCallback((c: number, q?: number) => {
    const formData = new FormData();
    formData.append("c", c.toString());
    if (q) {
      formData.append("q", q.toString());
    }
    deleteFetcher.submit(formData, {
      method: "POST",
      action: "/api/delete",
    });
  }, []);

  useEffect(() => {
    revalidator.revalidate();
  }, [deleteEvent]);

  return (
    <main>
      <title>Edit - Quiz</title>
      <div className="h-dvh w-dvw box-border p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Übersicht</h1>

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
                    className="sm:text-sm lg:text-lg"
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
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <Link
                          key={`${colIndex}-${rowIndex}`}
                          to={"/edit/" + colIndex + "/" + rowIndex}
                        >
                          <Button
                            variant={"outline"}
                            className={`w-full xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl  h-full flex items-center justify-center ${data.questions.get(colIndex + ":" + rowIndex) ? "!border-emerald-500" : "!border-red-400"}`}
                          >
                            {data.questions.get(colIndex + ":" + rowIndex)
                              ?.points ?? (rowIndex + 1) * 100}
                          </Button>
                        </Link>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-52">
                        <ContextMenuItem
                          onClick={() => deleteQuestion(colIndex, rowIndex)}
                          className={"text-destructive"}
                        >
                          <Trash className={"text-destructive"} /> Delete
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => deleteQuestion(colIndex)}
                          className={"text-destructive"}
                        >
                          <Trash className={"text-destructive"} /> Delete
                          Category
                        </ContextMenuItem>

                        {data.questions.get(colIndex + ":" + rowIndex) && (
                          <>
                            <ContextMenuItem>
                              <NavLink
                                className={"flex gap-2"}
                                to={`/show/preview/${colIndex}/${rowIndex}`}
                              >
                                <Tv /> Preview Show
                              </NavLink>
                            </ContextMenuItem>
                            <ContextMenuItem>
                              <NavLink
                                className={"flex gap-2"}
                                to={`/user/preview/${colIndex}/${rowIndex}`}
                              >
                                <UserRoundSearch /> Preview User
                              </NavLink>
                            </ContextMenuItem>
                          </>
                        )}
                      </ContextMenuContent>
                    </ContextMenu>
                  )),
                )}
              </div>
            </div>
          </div>
          <div className="ml-4 h-full self-end">
            <addCategoryFetcher.Form method="post" className="h-full">
              <input type="hidden" name="intent" value="addCategory" />
              <Button
                type="submit"
                className="h-full sm:text-2xl lg:text-5xl flex items-center justify-center"
              >
                +
              </Button>
            </addCategoryFetcher.Form>
          </div>
        </div>

        <div className="mt-4">
          <addDepthFetcher.Form method="post" className="w-full">
            <input type="hidden" name="intent" value="addQuestionDepth" />
            <Button
              type="submit"
              className="w-full h-full sm:text-2xl lg:text-5xl flex items-center justify-center"
            >
              +
            </Button>
          </addDepthFetcher.Form>
        </div>
      </div>
    </main>
  );
}
