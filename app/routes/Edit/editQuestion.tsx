import type { Route } from "./+types/editQuestion";
import { Form, redirect, useLoaderData } from "react-router";
import { getConfig } from "~/utils/config.server";
import BaseTypeSelect from "~/routes/Edit/components/BaseTypeSelect";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { prisma } from "~/utils/db.server";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const prompt = formData.get("prompt")?.toString() ?? "";
  const type = formData.get("baseType") as string;

  const c = Number(params.c);
  const q = (Number(params.q) + 1) * 100;

  if (!Number.isInteger(c) || !Number.isInteger(q)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  await prisma.questionEntity.upsert({
    where: {
      categoryColumn_points: { categoryColumn: c, points: q }, // composite unique key
    },
    update: {
      prompt,
    },
    create: {
      type: type,
      categoryColumn: c,
      points: q,
      prompt,
      config: {},
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

  const question = await prisma.questionEntity.findUnique({
    where: {
      categoryColumn_points: { categoryColumn: c, points: q },
    },
  });

  return { c, q, categoryName, question };
}

export default function EditQuestion() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className={"p-4"}>
      <h1 className={"text-xl"}>
        Edit question {(data.q + 1) * 100} of {data.categoryName ?? data.c}
      </h1>
      <Form method={"post"} className={"p-4 gap-2 flex flex-col"}>
        <BaseTypeSelect defaultValue={data.question?.type} />
        <Label htmlFor={"prompt"}>Prompt</Label>
        <Input
          name={"prompt"}
          id={"prompt"}
          defaultValue={data.question?.prompt}
        />
        <Button type="submit">Save</Button>
      </Form>
    </main>
  );
}
