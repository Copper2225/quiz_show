import {
  type ChangeEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";
import { Textarea } from "~/components/ui/textarea";

interface Props {
  answer?: string;
  locked: boolean;
}

const InputAnswerField = ({ answer, locked }: Props): ReactElement => {
  const fetcher = useFetcher();
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setIsDirty(event.currentTarget.value !== answer);
    },
    [answer],
  );

  useEffect(() => {
    setIsDirty(false);
  }, [answer]);

  return (
    <fetcher.Form
      method="post"
      action="/api/answer"
      className={
        "h-full w-full box-border p-3 gap-4 flex items-stretch justify-center flex-col"
      }
    >
      <Textarea
        className={"h-full text-start !text-4xl"}
        name="answer"
        disabled={locked}
        onChange={handleChange}
        defaultValue={answer}
      />
      <Button
        type={"submit"}
        disabled={!isDirty || locked}
        className={" w-full h-[150px] text-5xl box-border"}
      >
        Senden
      </Button>
    </fetcher.Form>
  );
};

export default InputAnswerField;
