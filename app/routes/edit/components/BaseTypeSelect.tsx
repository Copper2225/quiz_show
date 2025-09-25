"use client";

import * as React from "react";
import Select from "~/components/Select";
import { Label } from "~/components/ui/label";
import { useCallback, useMemo, useState } from "react";
import MultipleChoiceBaseEdit from "~/routes/edit/components/MultipleChoice/MultipleChoiceBaseEdit";
import { Input } from "~/components/ui/input";
import BuzzerBaseEdit from "~/routes/edit/components/Buzzer/BuzzerBaseEdit";
import InputBaseEdit from "~/routes/edit/components/Input/InputBaseEdit";
import OrderBaseEdit from "~/routes/edit/components/Order/OrderBaseEdit";

interface Props {
  defaultValue?: string;
  defaultPrompt?: string;
  defaultConfig?: any;
}

const types = [
  {
    value: "multipleChoice",
    label: "Multiple choice",
  },
  {
    value: "buzzer",
    label: "Buzzer",
  },
  {
    value: "input",
    label: "Input",
  },
  {
    value: "pin",
    label: "Pin",
  },
  {
    value: "order",
    label: "Order",
  },
  {
    value: "none",
    label: "None",
  },
];

const BaseTypeSelect = ({
  defaultValue,
  defaultPrompt,
  defaultConfig,
}: Props) => {
  const [type, setType] = useState<string>(defaultValue ?? "");
  const detailedForm = useMemo(() => {
    switch (type) {
      case "multipleChoice":
        return <MultipleChoiceBaseEdit defaultConfig={defaultConfig} />;
      case "buzzer":
        return <BuzzerBaseEdit defaultConfig={defaultConfig} />;
      case "input":
        return <InputBaseEdit defaultConfig={defaultConfig} />;
      case "order":
        return <OrderBaseEdit defaultConfig={defaultConfig} />;
    }
  }, [type]);

  const handleChange = useCallback((val: string) => {
    setType(val);
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
          defaultValue={defaultValue}
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
