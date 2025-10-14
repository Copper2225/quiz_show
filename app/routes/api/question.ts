import type { Route } from "./+types/question";
import {
  clearQuestion,
  setQuestionWithRowAndCat,
  disableActiveMatrix,
  clearUserAnswers,
  resetActiveMatrix,
  AdminData,
  setAllLocked,
} from "~/utils/playData.server";
import dot from "dot-object";
import { prisma } from "~/utils/db.server";
import { broadcast } from "../events/sse.events";
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;

  if (requestValues.mode === "open") {
    const quest =
      requestValues.data !== undefined
        ? await setQuestionWithRowAndCat(
            JSON.parse(requestValues.data).row,
            JSON.parse(requestValues.data).col,
          )
        : clearQuestion();

    clearUserAnswers();
    if (quest) {
      disableActiveMatrix(
        JSON.parse(requestValues.data).col,
        JSON.parse(requestValues.data).row,
      );
    } else {
      setAllLocked(false);
    }

    broadcast("answerType", { quest });

    return { quest };
  } else if (requestValues.mode === "switch") {
    if (requestValues.reset === "true") {
      resetActiveMatrix();
      broadcast("disableEvent", AdminData.activeMatrix);
      return;
    }

    const quest = await prisma.questionEntity.findFirst({
      where: {
        categoryColumn: JSON.parse(requestValues.data).col,
        row: JSON.parse(requestValues.data).row,
      },
    });

    if (quest) {
      disableActiveMatrix(
        JSON.parse(requestValues.data).col,
        JSON.parse(requestValues.data).row,
        true,
      );
      broadcast("disableEvent", AdminData.activeMatrix);
    }
    return { quest };
  } else if (requestValues.mode === "peek") {
    const categoryColumn = JSON.parse(requestValues.data).col;
    const row = JSON.parse(requestValues.data).row;
    return redirect(`/admin/peek/${categoryColumn}/${row}`);
  }
}
