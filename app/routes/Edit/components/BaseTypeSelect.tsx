"use client";

import * as React from "react";
import Select from "~/components/Select";
import { Label } from "~/components/ui/label";

interface Props {
  defaultValue?: string;
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

const BaseTypeSelect = ({ defaultValue }: Props) => {
  return (
    <>
      <Label htmlFor={"baseType"}>Base Type</Label>
      <Select
        options={types}
        name={"baseType"}
        label={"Type"}
        defaultValue={defaultValue}
      />
    </>
  );
};

export default BaseTypeSelect;
