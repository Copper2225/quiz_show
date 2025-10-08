import type { Route } from "./+types/delete";
import dot from "dot-object";
import { prisma } from "~/utils/db.server";
import { sendToAdmin } from "~/routes/events/sse.events.admin";
import { initConfig } from "~/utils/config.server";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());

  const values = dot.object(plainForm) as any;

  const c = Number(values.c);
  const q = Number(values.q);

  if (!Number.isInteger(c)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  if (values.q === undefined) {
    try {
      await prisma.categoryEntity.delete({
        where: {
          column: c,
        },
      });
    } catch (e) {
      console.error(e);
    }
    await initConfig();
    sendToAdmin("delete", { c, q });
    return;
  }

  if (!Number.isInteger(q)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  try {
    await prisma.questionEntity.delete({
      where: {
        categoryColumn_row: { categoryColumn: c, row: q },
      },
    });
  } catch (e) {
    console.log(e);
  }
  await initConfig();
  sendToAdmin("delete", { c, q });
  return;
}
