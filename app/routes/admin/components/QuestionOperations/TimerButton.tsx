import { type FC, useCallback, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { Clock } from "lucide-react";

interface Props {
  time: number;
}

const TimerButton: FC<Props> = ({ time }) => {
  const fetcher = useFetcher();

  const trigger30Timer = useCallback(() => {
    const formData = new FormData();
    formData.append("time", time.toString());
    fetcher.submit(formData, { action: "/api/timer", method: "POST" });
  }, []);

  const timeString = useMemo(() => {
    if (time < 60) return `${time}s`;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
  }, [time]);

  return (
    <Button className={"flex-1 h-16 text-3xl"} onClick={trigger30Timer}>
      <Clock className={"size-6"} /> {timeString}
    </Button>
  );
};

export default TimerButton;
