import { type FC } from "react";
import TimerButton from "~/routes/admin/components/QuestionOperations/TimerButton";

const BaseQuestionOperations: FC = () => {
  return (
    <div className={"flex my-4 w-full m gap-4"}>
      <TimerButton time={0} />
      <TimerButton time={10} />
      <TimerButton time={15} />
      <TimerButton time={30} />
      <TimerButton time={60} />
    </div>
  );
};

export default BaseQuestionOperations;
