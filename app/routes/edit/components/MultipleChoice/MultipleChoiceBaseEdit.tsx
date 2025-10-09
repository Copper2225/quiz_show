import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCallback, useMemo, useState } from "react";
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
    setAnswers((prev) => Math.max(prev - 1, 2));
  }, []);

  const options = useMemo(() => {
    return question?.config?.options ?? [];
  }, [question]);

  return (
    <>
      <div>
        <Label>Antworten</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Text</TableHead>
              <TableHead>Korrekt</TableHead>
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
                    options[i] ?? {
                      name: "",
                      checked: false,
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
        <Label htmlFor={"multiSelect"} className={"mb-2"}>
          Mehrfachauswahl
        </Label>
        <Checkbox
          name={"_check_config.multiSelect"}
          id={"_check_config.multiSelect"}
          defaultChecked={question?.config?.multiSelect}
        />
      </div>
      <div>
        <Label htmlFor={"shuffle"} className={"mb-2"}>
          Mischen
        </Label>
        <Checkbox
          name={"_check_config.shuffle"}
          id={"_check_config.shuffle"}
          defaultChecked={question?.config?.shuffle}
        />
      </div>
      <div>
        <Label htmlFor={"showLetters"} className={"mb-2"}>
          A,B,C,...
        </Label>
        <Checkbox
          name={"_check_config.showLetters"}
          id={"_check_config.showLetters"}
          defaultChecked={question?.config?.showLetters}
        />
      </div>
      <div>
        <Label htmlFor={"trueOrFalse"} className={"mb-2"}>
          Wahr / Falsch (Wahr zuerst)
        </Label>
        <Checkbox
          name={"_check_config.trueOrFalse"}
          id={"_check_config.trueOrFalse"}
          defaultChecked={question?.config?.trueOrFalse}
        />
      </div>
    </>
  );
};

export default MultipleChoiceBaseEdit;
