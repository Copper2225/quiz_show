import { playerData } from "~/utils/playData.server";
import type { ActionFunctionArgs } from "react-router";
import { broadcast } from "~/routes/events/sse.events";
import type { UserWaveLengthQuestion } from "~/types/userTypes";

export async function action({ }: ActionFunctionArgs) {
  (playerData.question as UserWaveLengthQuestion).config.showSlider = !(
    playerData.question as UserWaveLengthQuestion
  ).config.showSlider;

  broadcast("answerType", new Date());
}
