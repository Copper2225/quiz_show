import { type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import { useFetcher } from "react-router";

interface Props {
  isLocked: boolean | undefined;
  isPreview?: boolean;
}

const BuzzerField = ({ isLocked, isPreview = false }: Props): ReactElement => {
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
        type={isPreview ? "button" : "submit"}
        disabled={isLocked}
        className={"h-full w-full box-border"}
      />
    </fetcher.Form>
  );
};

export default BuzzerField;
