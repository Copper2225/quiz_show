import { type FC } from "react";
import { useFetcher } from "react-router";
import { Input } from "~/components/ui/input";

interface Props {
  time: number;
}

const TimerField: FC<Props> = ({ time }) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method={"post"} action={"/api/timer"}>
      <Input
        className={"flex-1 h-16 !text-3xl w-30"}
        name={"time"}
        placeholder={"60"}
        defaultValue={time}
        type={"number"}
      />
    </fetcher.Form>
  );
};

export default TimerField;
