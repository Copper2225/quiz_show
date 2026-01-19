import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { HigherLowerOperationsWrapper } from "~/routes/admin/components/QuestionOperations/HigherLowerOperations/HigherLowerOperationsWrapper";
import type { HigherLowerQuestion } from "~/types/adminTypes";

interface Props {
  question: HigherLowerQuestion | null;
  teamAnswers: Map<string, { answer: string; time: Date; }>;
}

export const HigherLowerOperations: React.FC<Props> = ({ question, teamAnswers }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"flex-1 h-full lg:text-2xl xl:text-3xl"}>
          Fragen Operationen
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[90%] sm:max-h-[80%] h-full flex flex-col"}>
        <DialogHeader>
          <DialogTitle>Fragen Operation</DialogTitle>
        </DialogHeader>
        {question && <HigherLowerOperationsWrapper question={question} teamAnswers={teamAnswers} />}
      </DialogContent>
    </Dialog>
  );
};
