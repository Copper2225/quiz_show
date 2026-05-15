import React, { type FC, useCallback } from "react";
import { QLCConnection } from "~/components/QLCConnection";
import { Button } from "~/components/ui/button";
import { ShowData } from "~/utils/playData.server";
import { useLoaderData } from "react-router";
import { RotateCw } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export async function loader() {
  return {
    teamNumber: ShowData.teams.size,
  };
}

const Random: FC = () => {
  const { teamNumber } = useLoaderData<typeof loader>();

  const handleRandomTeam = useCallback(async () => {
    const finalTeam = Math.floor(Math.random() * teamNumber) + 1;
    const extraSteps = 20; // Mindestanzahl für den Effekt
    const totalSteps = extraSteps + finalTeam;

    for (let i = 0; i < totalSteps; i++) {
      const currentTeam = (i % teamNumber) + 1;
      const formData = new FormData();
      formData.append("command", `active-t${currentTeam};255`);
      fetch("/api/light", { method: "POST", body: formData });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }, [teamNumber]);

  const handleBlue = useCallback(() => {
    const formData = new FormData();
    formData.append("command", "active-t1;255");
    fetch("/api/light", { method: "POST", body: formData });
  }, []);

  const handleWhite = useCallback(() => {
    const formData = new FormData();
    formData.append("command", "active-t2;255");
    fetch("/api/light", { method: "POST", body: formData });
  }, []);

  const handleSlide = useCallback((value: number[]) => {
    const formData = new FormData();
    formData.append("command", `active-t3;${value[0]}`);
    fetch("/api/light", { method: "POST", body: formData });
  }, []);

  const handleReset = useCallback(() => {
    const formData = new FormData();
    formData.append("command", "active-no-selector;255");
    fetch("/api/light", { method: "POST", body: formData });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <QLCConnection />
      <div className={"flex gap-3"}>
        <Button className={"flex-1"} onClick={handleRandomTeam}>
          Random Team
        </Button>
        <Button onClick={handleReset}>
          <RotateCw />
        </Button>
      </div>
      <div className={"flex gap-3"} />
      <Button className={"flex-1"} onClick={handleBlue}>
        Blau
      </Button>
      <Button className={"flex-1"} onClick={handleWhite}>
        Weiß
      </Button>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        onValueChange={handleSlide}
        defaultValue={[30]}
        max={255}
        min={0}
        step={1}
      >
        <SliderPrimitive.Track className="bg-gray-800 relative grow rounded-full h-1.5">
          <SliderPrimitive.Range
            className={`absolute rounded-full h-full bg-primary`}
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className={`block w-5 h-5 bg-black border-2 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.1)] focus:outline-none transition-transform active:scale-90`}
        />
      </SliderPrimitive.Root>
    </div>
  );
};

export default Random;