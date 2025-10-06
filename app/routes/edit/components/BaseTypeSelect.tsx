"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import Select from "~/components/Select";
import { Label } from "~/components/ui/label";
import MultipleChoiceBaseEdit from "~/routes/edit/components/MultipleChoice/MultipleChoiceBaseEdit";
import { Input } from "~/components/ui/input";
import BuzzerBaseEdit from "~/routes/edit/components/Buzzer/BuzzerBaseEdit";
import InputBaseEdit from "~/routes/edit/components/Input/InputBaseEdit";
import OrderBaseEdit from "~/routes/edit/components/Order/OrderBaseEdit";
import PinBaseEdit from "~/routes/edit/components/Pin/PinBaseEdit";
import { type Question, QuestionType } from "~/types/question";
import type { JsonValue } from "@prisma/client/runtime/client";
import type {
  BuzzerQuestion,
  InputQuestion,
  MultipleChoiceQuestion,
  OrderQuestion,
  PinQuestion,
} from "~/types/adminTypes";

interface Props {
  defaultValue?: QuestionType;
  defaultPrompt?: string;
  question?: Question<JsonValue>;
}

const types = [
  {
    value: QuestionType.MULTIPLE_CHOICE,
    label: "Multiple choice",
  },
  {
    value: QuestionType.BUZZER,
    label: "Buzzer",
  },
  {
    value: QuestionType.INPUT,
    label: "Input",
  },
  {
    value: QuestionType.PIN,
    label: "Pin",
  },
  {
    value: QuestionType.ORDER,
    label: "Order",
  },
  {
    value: QuestionType.NONE,
    label: "None",
  },
];

const BaseTypeSelect = ({ defaultValue, defaultPrompt, question }: Props) => {
  const [type, setType] = useState<"" | QuestionType>(defaultValue ?? "");
  const detailedForm = useMemo(() => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceBaseEdit
            question={question as MultipleChoiceQuestion}
          />
        );
      case QuestionType.BUZZER:
        return <BuzzerBaseEdit question={question as BuzzerQuestion} />;
      case QuestionType.INPUT:
        return <InputBaseEdit question={question as InputQuestion} />;
      case QuestionType.ORDER:
        return <OrderBaseEdit question={question as OrderQuestion} />;
      case QuestionType.PIN:
        return <PinBaseEdit question={question as PinQuestion} />;
    }
  }, [type, question]);

  const handleChange = useCallback((val: string) => {
    setType(val as QuestionType);
  }, []);

  return (
    <div className={"flex flex-col gap-4"}>
      <div>
        <Label className={"mb-2"} htmlFor={"baseType"}>
          Base Type
        </Label>
        <Select
          options={types}
          name={"baseType"}
          label={"Type"}
          defaultValue={defaultValue?.toString()}
          onChange={handleChange}
          className={"w-full justify-start"}
          align={"start"}
        />
      </div>
      <div>
        <Label className={"mb-2"} htmlFor={"prompt"}>
          Prompt
        </Label>
        <Input name={"prompt"} id={"prompt"} defaultValue={defaultPrompt} />
      </div>
      {detailedForm}
    </div>
  );
};

export default BaseTypeSelect;
