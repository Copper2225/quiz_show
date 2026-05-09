import { useFetcher } from "react-router";
import React, { useCallback } from "react";
import { Button } from "~/components/ui/button";

export const BuzzerOperations: React.FC = () => {
  const fetcher = useFetcher();

  const handleUnblock = useCallback(() => {
    fetcher.submit(new FormData(), {
      method: "post",
      action: "/api/buzzer/unblock",
    });
  }, [fetcher]);

  const handleWrong = useCallback(() => {
    fetcher.submit(new FormData(), {
      method: "post",
      action: "/api/wrongAnswer",
    });
  }, [fetcher]);

  return (
    <div className={"flex flex-col gap-2"}>
      <h3 className="text-lg font-medium">Buzzer Operationen</h3>
      <Button
        className="h-20 text-xl"
        onClick={handleWrong}
        variant={"destructive"}
      >
        Falsch / Blockieren
      </Button>
      <Button className="h-20 text-xl" onClick={handleUnblock}>
        Buzzer Unblock / Reset
      </Button>
    </div>
  );
};
