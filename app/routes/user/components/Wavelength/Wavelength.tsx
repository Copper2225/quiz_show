import {
  type ChangeEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import StepSlider from "~/components/ui/stepSlider";
import { Input } from "~/components/ui/input";
import type { UserHint } from "~/types/userTypes";

interface Props {
  isLocked: boolean | undefined;
  isPreview?: boolean;
  useNumber: boolean;
  hint: UserHint | undefined;
  isEmoji: boolean;
  answer?: string;
}

const WaveLength = ({
  isLocked,
  hint,
  isPreview = false,
  useNumber,
  isEmoji,
  answer,
}: Props): ReactElement => {
  const fetcher = useFetcher();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(false);
  }, [answer]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setIsDirty(event.currentTarget.value !== answer);
    },
    [answer],
  );

  const handleChangeSlider = useCallback(
    (val: number[]) => {
      setIsDirty(val.toString() !== answer);
    },
    [answer],
  );

  return (
    <fetcher.Form
      method="post"
      action="/api/answer"
      className={
        "h-full w-full box-border p-3 flex flex-col items-stretch justify-center"
      }
    >
      <h1 className={"text-6xl text-center mb-6"}>
        {isEmoji && Array.isArray(hint?.emojis)
          ? hint?.emojis.map((e) => {
              return <img key={e} src={e} alt={e} />;
            })
          : hint?.hint}
      </h1>
      {useNumber ? (
        <StepSlider
          className={"h-full self-center w-full"}
          name={"answer"}
          disabled={isLocked}
          onChange={handleChangeSlider}
        />
      ) : (
        <Input
          className={"h-full self-center w-full"}
          autoComplete={"off"}
          name={"answer"}
          onChange={handleChange}
          disabled={isLocked}
          defaultValue={answer}
        />
      )}
      <Button
        type={isPreview ? "button" : "submit"}
        disabled={isLocked || !isDirty}
        className={"w-full box-border"}
      >
        Bestätigen
      </Button>
    </fetcher.Form>
  );
};

export default WaveLength;
