import { Label } from "~/components/ui/label";
import React from "react";
import PinImageSelect from "~/routes/edit/components/Pin/PinImageSelect";
import type { PinQuestion } from "~/types/adminTypes";

interface Props {
  question?: PinQuestion;
}

const PinBaseEdit = ({ question }: Props) => {
  return (
    <div className={"flex flex-col gap-2"}>
      <div>
        <Label className={"mb-2"}>Image</Label>
      </div>
      <PinImageSelect defaultData={question?.config} />
    </div>
  );
};

export default PinBaseEdit;
