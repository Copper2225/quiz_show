import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { Label } from "~/components/ui/label";
import { EmojiInput } from "~/routes/user/components/Wavelength/EmojiInput";
import { Input } from "~/components/ui/input";

interface Props {
  show: boolean;
  target: string;
  emoji: boolean;
}

const Target = ({ show = true, target, emoji }: Props): ReactElement => {
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
      <Label className={"flex-2 self-center text-4xl"}>{target}</Label>
      {emoji ? (
        <EmojiInput />
      ) : (
        <Input
          autoComplete={"off"}
          name={"hint"}
          className={"flex-2 mb-3 !text-6xl"}
        />
      )}
      <Button type={"submit"} className={"w-full flex-1 text-5xl box-border"}>
        Bestätigen
      </Button>
    </fetcher.Form>
  );
};

export default Target;
