import type { ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";

const BuzzerField = (): ReactElement => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/api/buzzer"
      className={
        "h-full w-full box-border p-3 flex items-stretch justify-center"
      }
    >
      <input hidden name="event" value="buzzer" />
      <input
        hidden
        name="data"
        value={JSON.stringify({ timestamp: new Date() })}
      />
      <Button type={"submit"} className={"h-full w-full box-border"} />
    </fetcher.Form>
  );
};

export default BuzzerField;
