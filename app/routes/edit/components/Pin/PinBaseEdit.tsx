import React from "react";
import PinImageSelect from "~/routes/edit/components/Pin/PinImageSelect";
import type { PinQuestion } from "~/types/adminTypes";

interface Props {
  question?: PinQuestion;
}

const PinBaseEdit = ({ question }: Props) => {
  return <PinImageSelect defaultData={question?.config} />;
};

export default PinBaseEdit;
