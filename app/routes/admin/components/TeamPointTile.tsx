import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Minus, Plus, UserMinus } from "lucide-react";
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
  const [addDisable, setAddDisable] = useState(false);
  const [halfDisable, setHalfDisable] = useState(false);
  const [minusDisable, setMinusDisable] = useState(false);

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

  const kickUser = useCallback(async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("kick", "true");
    await setPointsFetcher.submit(formData, {
      method: "POST",
      action: "/api/teams",
    });
  }, [name, setPointsFetcher, questionPoints, points]);

  const onAddClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      setAddDisable(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points + questionPoints).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
      setTimeout(() => setAddDisable(false), 1000);
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  const onHalfClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      setHalfDisable(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points - questionPoints / 2).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
      setTimeout(() => setHalfDisable(false), 1000);
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  const onMinusClick = useCallback(async () => {
    if (questionPoints !== undefined) {
      setMinusDisable(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("points", (points - questionPoints).toString());
      await setPointsFetcher.submit(formData, {
        method: "POST",
        action: "/api/teams",
      });
      setTimeout(() => setMinusDisable(false), 1000);
    }
  }, [name, setPointsFetcher, questionPoints, points]);

  useEffect(() => {
    setPointsValue(points);
  }, [points]);

  return (
    <div key={name} className={"flex justify-between"}>
      <div className={"flex gap-3 items-center"}>
        <div className={"min-w-[14em] max-w-[14em]"}>{name}:</div>
        <Input
          name={"points"}
          value={pointsValue}
          onChange={handleChange}
          className={"min-w-[300px] max-w-[300px]"}
          type={"number"}
          onBlur={onBlur}
        />
        <Button disabled={addDisable} onClick={onAddClick}>
          <Plus strokeWidth={4} />
        </Button>
        <Button
          className={
            "p-0! aspect-square bg-destructive hover:bg-destructive hover:opacity-75"
          }
          disabled={halfDisable}
          onClick={onHalfClick}
        >
          <MinusHalfIcon
            className={"size-7"}
            strokeWidth={8}
            fill={"#FFFFFF"}
          />
        </Button>
        <Button
          className={
            "p-0! aspect-square bg-destructive hover:bg-destructive hover:opacity-75"
          }
          disabled={minusDisable}
          onClick={onMinusClick}
        >
          <Minus strokeWidth={4} />
        </Button>
      </div>
      <Button className={"self-end"} onClick={kickUser}>
        <UserMinus />
      </Button>
    </div>
  );
};

export default TeamPointTile;
