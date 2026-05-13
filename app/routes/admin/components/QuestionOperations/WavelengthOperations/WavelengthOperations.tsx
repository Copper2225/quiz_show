import { useFetcher, useRevalidator } from "react-router";
import React, { useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useEventSource } from "remix-utils/sse/react";
import type { UserHint } from "~/types/userTypes";

interface Props {
  userShowHints: Map<string, UserHint>;
}

export const WavelengthOperations: React.FC<Props> = ({ userShowHints }) => {
  const fetcher = useFetcher();
  const answerEvent = useEventSource("/sse/events", { event: "answer" });
  const revalidate = useRevalidator();

  const handleTrigger = useCallback(() => {
    fetcher.submit(new FormData(), {
      method: "post",
      action: "/api/wavelength/trigger",
    });
  }, []);

  const handleTriggerHint = useCallback(() => {
    fetcher.submit(new FormData(), {
      method: "post",
      action: "/api/wavelength/show",
    });
  }, []);

  useEffect(() => {
    revalidate.revalidate();
  }, [answerEvent]);

  const handleRevealAll = useCallback(() => {
    const formData = new FormData();
    formData.append("all", "true");
    formData.append("reveal", "true");
    fetcher.submit(formData, {
      method: "post",
      action: "/api/userReveal",
    });
  }, []);

  return (
    <>
      <div className={"flex gap-2 mb-2"}>
        <Button onClick={handleTriggerHint}>Show hint</Button>
        <Button onClick={handleTrigger}>Trigger</Button>
        <Button onClick={handleRevealAll}>Reveal Team Hints</Button>
      </div>
      {Array.from(userShowHints.entries()).map(([name, showHint]) => (
        <fetcher.Form
          method="post"
          action="/api/wavelength/checked"
          className={"flex justify-between"}
        >
          <span
            className={`${showHint.isInit ? "text-red-500" : "text-green-600"}`}
            key={name}
          >
            <input name={"user"} value={name} readOnly className={"hidden"} />
            {name}: {showHint.isInit ? "Nicht Bereit" : showHint.hint}
          </span>
          <Button>Trigger</Button>
        </fetcher.Form>
      ))}
    </>
  );
};
