import type { Route } from "./+types/edit.question";
import { Form, redirect, useLoaderData } from "react-router";
import { getConfig } from "~/utils/config.server";
import BaseTypeSelect from "~/routes/edit/components/BaseTypeSelect";
import { prisma } from "~/utils/db.server";
import dot from "dot-object";
import MediaBase from "~/routes/edit/components/MediaEdit/MediaBase";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { Question, QuestionType } from "~/types/question";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());

  const values = dot.object(plainForm) as any;

  const c = Number(params.c);
  const q = Number(params.q);

  if (!Number.isInteger(c) || !Number.isInteger(q)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  await prisma.questionEntity.upsert({
    where: {
      categoryColumn_row: { categoryColumn: c, row: q }, // composite unique key
    },
    update: {
      prompt: values.prompt,
      config: values.config,
      points: Number(values.points),
    },
    create: {
      type: values.baseType,
      categoryColumn: c,
      row: q,
      points: Number(values.points),
      prompt: values.prompt,
      config: values.config ?? {},
    },
  });

  return redirect("/edit");
}

export async function loader({ params }: Route.LoaderArgs) {
  const c = Number(params.c);
  const q = Number(params.q);
  const categoryName = getConfig().categories.find(
    (_cate, index) => index === c,
  );
  if (!Number.isInteger(c) || !Number.isInteger(q)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const question = (await prisma.questionEntity.findUnique({
    where: {
      categoryColumn_row: {
        categoryColumn: c,
        row: q,
      },
    },
  })) as Question<any>;

  return { c, q, categoryName, question };
}

export default function EditQuestion() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className={"p-4"}>
      <h1 className={"text-xl"}>
        Edit question {data.question?.points ?? (data.q + 1) * 100} of{" "}
        {data.categoryName ?? data.c}
      </h1>
      <Form method={"post"} className={"p-4 gap-2 flex flex-col"}>
        <div>
          <Label className={"mb-2"}>Points</Label>
          <Input
            name={"points"}
            id={"points"}
            defaultValue={data.question?.points ?? (data.q + 1) * 100}
            type={"number"}
          />
        </div>
        <BaseTypeSelect
          defaultValue={data.question?.type as QuestionType}
          defaultPrompt={data.question?.prompt}
          question={data.question}
        />
        <MediaBase
          defaultConfig={(data.question?.config as any)?.media ?? undefined}
        />
        <Button className={"mt-5"} type="submit">
          Save
        </Button>
      </Form>
    </main>
  );
}
