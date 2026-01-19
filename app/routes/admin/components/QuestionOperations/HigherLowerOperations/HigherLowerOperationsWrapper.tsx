import type { HigherLowerQuestion } from "~/types/adminTypes";
import { DynamicAxisAdmin } from "~/routes/admin/components/QuestionOperations/HigherLowerOperations/DynamicAxisAdmin";
import { useFetcher } from "react-router";
import React, { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TeamSetLives } from "~/routes/admin/components/QuestionOperations/HigherLowerOperations/TeamSetLives";
import { Label } from "~/components/ui/label";

interface Props {
  question: HigherLowerQuestion;
  teamAnswers: Map<string, { answer: string; time: Date }>;
}

export const HigherLowerOperationsWrapper: React.FC<Props> = ({
  question,
  teamAnswers,
}) => {
  const fetcher = useFetcher();

  const handleWrongAnswer = useCallback(() => {
    fetcher.submit(new FormData(), {
      method: "post",
      action: "/api/wrongAnswer",
    });
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formData = new FormData();
      formData.append("selector", event.currentTarget.value);
      fetcher.submit(formData, {
        method: "post",
        action: "/api/higherLower/selector",
      });
    },
    [],
  );

  return (
    <div className={"flex flex-col h-full gap-2"}>
      <DynamicAxisAdmin items={question.config.options} />
      <Button onClick={handleWrongAnswer}>Wrong</Button>
      <div>
        <Label className={"mb-1"} htmlFor={"selector"}>Wer ist dran:</Label>
        <Input
          className={"w-[50px]"}
          defaultValue={question.config.selector}
          onChange={handleChange}
        />
      </div>
      <TeamSetLives teamAnswers={teamAnswers} />
    </div>
  );
};
