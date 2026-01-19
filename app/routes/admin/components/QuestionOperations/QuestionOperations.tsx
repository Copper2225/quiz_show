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
import { type Question, QuestionType } from "~/types/question";
import type { MediaConfig } from "~/types/adminTypes";
import { MediaOperationsWrapper } from "~/routes/admin/components/QuestionOperations/MediaOperations/MediaOperationsWrapper";
import { WavelengthOperations } from "~/routes/admin/components/QuestionOperations/WavelengthOperations/WavelengthOperations";
import type { UserHint } from "~/types/userTypes";

interface Props {
  question: Question<any>;
  teamAnswers: Map<string, { answer: string; time: Date }>;
  userShowHints: Map<string, UserHint>;
}

export const QuestionOperations: React.FC<Props> = ({
  question,
  teamAnswers,
  userShowHints,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"flex-1 h-full lg:text-2xl xl:text-3xl"}>
          Fragen Operationen
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"sm:max-w-[90%] sm:max-h-[80%] h-full flex flex-col"}
      >
        <DialogHeader>
          <DialogTitle>Fragen Operation</DialogTitle>
        </DialogHeader>
        {question?.type === QuestionType.HIGHER_LOWER && (
          <HigherLowerOperationsWrapper
            question={question}
            teamAnswers={teamAnswers}
          />
        )}
        {question?.type === QuestionType.WAVELENGTH && (
          <WavelengthOperations userShowHints={userShowHints} />
        )}
        {(question?.config?.media as MediaConfig)?.mediaChecked && (
          <MediaOperationsWrapper />
        )}
      </DialogContent>
    </Dialog>
  );
};
