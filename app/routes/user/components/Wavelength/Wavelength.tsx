import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import StepSlider from "~/components/ui/stepSlider";

interface Props {
  isLocked: boolean | undefined;
  isPreview?: boolean;
  hint?: string;
}

const WaveLength = ({
  isLocked,
  hint,
  isPreview = false,
}: Props): ReactElement => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/api/answer"
      className={
        "h-full w-full box-border p-3 flex flex-col items-stretch justify-center"
      }
    >
      <h1>{hint}</h1>
      <StepSlider
        className={"h-full self-center w-full"}
        name={"answer"}
        disabled={isLocked}
      />
      <Button
        type={isPreview ? "button" : "submit"}
        disabled={isLocked}
        className={"w-full box-border"}
      >
        Bestätigen
      </Button>
    </fetcher.Form>
  );
};

export default WaveLength;
