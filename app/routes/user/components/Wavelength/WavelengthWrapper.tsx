import React from "react";
import Target from "~/routes/user/components/Wavelength/Target";
import WaveLength from "~/routes/user/components/Wavelength/Wavelength";
import type { UserHint, UserWaveLengthQuestion } from "~/types/userTypes";

interface Props {
  isLocked: boolean;
  hint?: UserHint;
  question: UserWaveLengthQuestion;
  answer?: string;
}

export const WavelengthWrapper: React.FC<Props> = ({
  isLocked,
  hint,
  answer,
  question,
}) => {
  return (
    <>
      {!question.config.showSlider && hint ? (
        <Target
          show={hint.showInit}
          target={hint.hint}
          emoji={question.config.emoji}
        />
      ) : (
        <WaveLength
          isLocked={isLocked}
          hint={hint}
          useNumber={question.config.useNumber}
          isEmoji={question.config.emoji}
          answer={answer}
        />
      )}
    </>
  );
};
