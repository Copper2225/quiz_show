import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface Props {
  show: boolean;
  target: string;
}

const Target = ({ show = true, target }: Props): ReactElement => {
  const fetcher = useFetcher();

  if (!show) {
    return <></>;
  }

  return (
    <fetcher.Form
      method="post"
      action="/api/wavelength/checked"
      className={
        "h-full w-full box-border p-3 flex flex-col items-stretch justify-center"
      }
    >
      <Label className={"flex-2 self-center text-9xl"}>{target}</Label>
      <Input name={"hint"} className={"flex-2 mb-3 !text-6xl"} />
      <Button type={"submit"} className={"w-full flex-1 text-5xl box-border"}>
        Bestätigen
      </Button>
    </fetcher.Form>
  );
};

export default Target;
