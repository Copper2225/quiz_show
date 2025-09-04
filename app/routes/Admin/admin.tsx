import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect, useState } from "react";

export default function Admin() {
  const fetcher = useFetcher();
  const buzzerLog = useEventSource("/sse/events", { event: "buzzer" });
  const [buzzes, setBuzzes] = useState<
    { from: string; data: { timestamp: string } }[]
  >([]);

  useEffect(() => {
    if (buzzerLog !== null) {
      try {
        const payload = JSON.parse(buzzerLog);
        console.log(payload);
        setBuzzes((buzzes) => [...buzzes, payload]);
      } catch {}
    }
  }, [buzzerLog]);

  return (
    <main className={"h-dvh w-dvw box-border p-4"}>
      <div className={"h-full w-full box-border flex flex-col gap-4"}>
        <h1 className={"text-xl font-semibold"}>Admin</h1>
        <fetcher.Form
          method="post"
          action="/sse/events"
          className="flex flex-col gap-2"
        >
          <input type="hidden" name="event" value="answerType" />
          <input
            hidden
            name="data"
            readOnly
            value={JSON.stringify({ type: "buzzer" })}
          />
          <Button type="submit">Give Buzzers</Button>
        </fetcher.Form>
        <ul className="text-sm text-muted-foreground">
          {buzzes.map((buzzer) => (
            <li key={buzzer.data.timestamp}>
              {buzzer.from} - {buzzer.data.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
