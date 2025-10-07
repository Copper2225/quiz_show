import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCallback, useState } from "react";
import OptionLine from "~/routes/edit/components/MultipleChoice/OptionLine";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import type { MultipleChoiceQuestion } from "~/types/adminTypes";

interface Props {
  question?: MultipleChoiceQuestion;
}

const MultipleChoiceBaseEdit = ({ question }: Props) => {
  const [answers, setAnswers] = useState<number>(
    question?.config?.options?.length ?? 2,
  );

  const addAnswer = useCallback(() => {
    setAnswers((prev) => prev + 1);
  }, []);

  const removeAnswer = useCallback(() => {
    setAnswers((prev) => prev - 1);
  }, []);

  return (
    <>
      <div>
        <Label>Answers</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Text</TableHead>
              <TableHead>Correct</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: answers }, (_v, i) => {
              return (
                <OptionLine
                  index={i}
                  key={i}
                  answers={answers}
                  removeAnswer={removeAnswer}
                  defaultValues={
                    question?.config?.options[i] ?? {
                      name: "",
                      checked: "off",
                    }
                  }
                />
              );
            })}
          </TableBody>
        </Table>
        <Button
          className={"w-full"}
          type={"button"}
          variant={"secondary"}
          onClick={addAnswer}
        >
          +
        </Button>
      </div>
      <div>
        <Label htmlFor={"shuffle"} className={"mb-2"}>
          Shuffle
        </Label>
        <Checkbox
          name={"config.shuffle"}
          id={"config.shuffle"}
          defaultChecked={question?.config?.shuffle === "on"}
        />
      </div>
      <div>
        <Label htmlFor={"showLetters"} className={"mb-2"}>
          Show Letters
        </Label>
        <Checkbox
          name={"config.showLetters"}
          id={"config.showLetters"}
          defaultChecked={question?.config?.showLetters === "on"}
        />
      </div>
      <div>
        <Label htmlFor={"trueOrFalse"} className={"mb-2"}>
          True or False (true first)
        </Label>
        <Checkbox
          name={"config.trueOrFalse"}
          id={"config.trueOrFalse"}
          defaultChecked={question?.config?.trueOrFalse === "on"}
        />
      </div>
    </>
  );
};

export default MultipleChoiceBaseEdit;
