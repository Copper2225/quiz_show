import { Label } from "~/components/ui/label";
import React from "react";
import PinImageSelect from "~/routes/edit/components/Pin/PinImageSelect";

interface Props {
  defaultConfig?: any;
}

const PinBaseEdit = ({ defaultConfig }: Props) => {
  return (
    <div className={"flex flex-col gap-2"}>
      <div>
        <Label className={"mb-2"}>Image</Label>
      </div>
      <PinImageSelect defaultData={defaultConfig} />
    </div>
  );
};

export default PinBaseEdit;
