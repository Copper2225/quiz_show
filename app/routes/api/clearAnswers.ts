import { clearUserAnswers } from "~/utils/playData.server";

export async function action() {
  clearUserAnswers();
}
