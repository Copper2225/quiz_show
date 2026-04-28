import { Input } from "~/components/ui/input";
import { useCallback } from "react";
import { Form, useFetcher } from "react-router";

interface Props {
  teamAnswers: Map<string, { answer: string; time: Date }>;
}

export const TeamSetLives: React.FC<Props> = ({ teamAnswers }) => {
  const fetcher = useFetcher();

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const form = event.currentTarget.form;
      if (!form) return;

      fetcher.submit(form, {
        action: "/api/higherLower/userLives",
        method: "post",
      });
    },
    [fetcher],
  );

  return (
    <>
      {Array.from(teamAnswers.entries()).map(([name, answer]) => (
        <Form key={name}>
          <span>{name}:</span>
          <input name="team" readOnly className="hidden" value={name} />
          <Input
            name="answer"
            defaultValue={answer.answer}
            onChange={onChange}
          />
        </Form>
      ))}
    </>
  );
};
