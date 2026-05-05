import React, { useState } from "react";
import { CogIcon, ShuffleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "@radix-ui/react-menu";
import { createCookie } from "@remix-run/node";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "react-router";
import _ from "lodash";
import { Input } from "~/components/ui/input";
const { shuffle } = _;

const slfCookie = createCookie("QUIZ_SLF", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // 24 hours
  maxAge: 60 * 60 * 24,
});

const defaultCategories = ["Stadt", "Land", "Fluss"];
const defaultLetters = "ABCDEFGHIJKLMNOPRSTUVZ".split("");

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = await slfCookie.parse(cookieHeader);
  const categories = cookieValue?.categories ?? defaultCategories;
  const letters = cookieValue?.letters ?? defaultLetters;
  const letterCount = cookieValue?.letterCount ?? 5;

  return json({ categories, letters, letterCount });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const categories = formData.get("categories") as string;
  const letters = formData.get("letters") as string;
  const letterCount = Number.parseInt(formData.get("letterCount") as string);

  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = (await slfCookie.parse(cookieHeader)) || {};

  if (categories !== null) {
    cookieValue.categories = categories.split(",").map((c) => c.trim());
  }
  if (letters !== null) {
    cookieValue.letters = letters.split(",").map((l) => l.trim());
  }
  if (letterCount !== null) {
    cookieValue.letterCount = letterCount;
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await slfCookie.serialize(cookieValue),
      },
    }
  );
}

const StadtLandFluss: React.FC = () => {
  const { categories: initialCategories, letters: initialLetters, letterCount: initialLetterCount } =
    useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [letters, setLetters] = useState<string[]>(initialLetters);
  const [letterCount, setLetterCount] = useState<number>(initialLetterCount);
  const fetcher = useFetcher();

  const [showLetters, setShowLetters] = useState(false);

  return (
    <>
      <main
        className="h-dvh w-dvw box-border px-4 pt-8 flex flex-col"
        style={{ fontFamily: "Unkempt, Love Ya Like A Sister, chalkduster" }}
      >
        <title>Stadt Land Fluss</title>
        <div className={"flex items-center w-full flex-col"}>
          <h1
            style={{ fontFamily: "chalkduster" }}
            className={"justify-center text-8xl flex-1 text-center mb-4"}
          >
            Stadt Land Fluss
          </h1>
          <hr className="w-4/5 border-t-6 border-dashed border-white mb-4" />
          <div className={"w-3/5 flex"}>
            <div className={"flex-1 justify-items-center"}>
              <h3 className={"text-6xl mb-4"}>Kategorien</h3>
              <ul className={"gap-3 flex flex-col min-w-4/5 w-fit"}>
                {categories.map((element) => (
                  <li
                    key={element}
                    className={
                      "bg-primary outline-offset-[-8px] px-5 outline-3 outline-white text-5xl rounded-2xl py-3 text-primary-foreground shadow-xs hover:bg-primary/90"
                    }
                  >
                    {element}
                  </li>
                ))}
              </ul>
            </div>
            <div className={"flex-1 justify-items-center"}>
              <h3 className={"text-6xl mb-4"}>Buchstaben</h3>
              <ul className={"gap-3 flex flex-col w-fit"}>
                {shuffle(letters)
                  .slice(0, letterCount)
                  .map((element) => (
                    <li
                      key={element}
                      className={
                        "bg-indigo-800 w-20 text-center outline-offset-[-5px] px-5 outline-2 outline-white text-5xl rounded-2xl py-3 text-primary-foreground shadow-xs hover:bg-indigo-800/90"
                      }
                    >
                      {showLetters ? element : "?"}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          className={
            "absolute top-4 left-4 opacity-0 hover:opacity-100 transition-opacity"
          }
          onClick={() => setShowLetters((prevState) => !prevState)}
        >
          <ShuffleIcon className={"size-10"} />
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className={
                "absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity"
              }
            >
              <CogIcon className={"size-10"} />
            </button>
          </DialogTrigger>
          <DialogContent className={""}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Kategorien</Label>
                <Textarea
                  className={"w-full"}
                  defaultValue={categories.join(", ")}
                  onChange={(event) => {
                    const newCategories = event.currentTarget.value
                      .split(",")
                      .map((c) => c.trim());
                    setCategories(newCategories);
                    fetcher.submit(
                      {
                        categories: event.currentTarget.value,
                        letters: letters.join(", "),
                      },
                      { method: "post" },
                    );
                  }}
                />
              </div>
              <div>
                <Label>Buchstaben</Label>
                <Textarea
                  className={"w-full"}
                  defaultValue={letters.join(", ")}
                  onChange={(event) => {
                    const newLetters = event.currentTarget.value
                      .split(",")
                      .map((l) => l.trim());
                    setLetters(newLetters);
                    fetcher.submit(
                      {
                        categories: categories.join(", "),
                        letters: event.currentTarget.value,
                      },
                      { method: "post" },
                    );
                  }}
                />
              </div>
              <div>
                <Label>Anzahl Buchstaben</Label>
                <Input
                  className={"w-full"}
                  defaultValue={letterCount}
                  type={"number"}
                  min={1}
                  max={10}
                  onChange={(event) => {
                    const newLetters = event.currentTarget.value
                    setLetterCount(Number.parseInt(newLetters));
                    fetcher.submit(
                      {
                        categories: categories.join(", "),
                        letters: letters.join(", "),
                        letterCount: newLetters,
                      },
                      { method: "post" },
                    );
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default StadtLandFluss;
