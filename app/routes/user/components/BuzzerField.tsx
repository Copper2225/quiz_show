import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";

interface Props {
  isLocked: boolean | undefined;
}

const BuzzerField = ({ isLocked }: Props): ReactElement => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/api/answer"
      className={
        "h-full w-full box-border p-3 flex items-stretch justify-center"
      }
    >
      <input hidden name="answer" readOnly value="buzzer" />
      <Button
        type={"submit"}
        disabled={isLocked}
        className={"h-full w-full box-border"}
      />
    </fetcher.Form>
  );
};

export default BuzzerField;
