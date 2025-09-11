import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { type ReactElement, useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import MinusHalfIcon from "~/routes/admin/components/MinusHalfIcon";

interface Props {
  name: string;
  points: number;
  questionPoints: number | undefined;
}

const TeamPointTile = ({
  name,
  points,
  questionPoints,
}: Props): ReactElement => {
  const setPointsFetcher = useFetcher();
  const [pointsValue, setPointsValue] = useState<number>(points);

  const onBlur = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", Number(event.target.value).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
    },
    [name, setPointsFetcher],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPointsValue(event.target.valueAsNumber);
    },
    [],
  );

  const onAddClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points + questionPoints).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  const onHalfClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points - questionPoints / 2).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  const onMinusClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points - questionPoints).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  useEffect(() => {
    setPointsValue(points);
  }, [points]);

  return (
    <div key={name} className={"flex items-center gap-3"}>
      <div>{name}:</div>
      <Input
        name={"points"}
        value={pointsValue}
        onChange={handleChange}
        className={"w-[300px]"}
        type={"number"}
        onBlur={onBlur}
      />
      <Button onClick={onAddClick}>
        <Plus strokeWidth={4} />
      </Button>
      <Button
        className={"p-0! aspect-square bg-destructive"}
        onClick={onHalfClick}
      >
        <MinusHalfIcon className={"size-7"} strokeWidth={8} fill={"#FFFFFF"} />
      </Button>
      <Button
        className={"p-0! aspect-square bg-destructive"}
        onClick={onMinusClick}
      >
        <Minus strokeWidth={4} />
      </Button>
    </div>
  );
};

export default TeamPointTile;
