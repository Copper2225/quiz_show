import React from "react";
import Target from "~/routes/user/components/Wavelength/Target";
import WaveLength from "~/routes/user/components/Wavelength/Wavelength";
import type { UserHint } from "~/types/userTypes";

interface Props {
  isLocked: boolean;
  hint?: UserHint;
  input: boolean;
}

export const WavelengthWrapper: React.FC<Props> = ({
  isLocked,
  hint,
  input,
}) => {
  return (
    <>
      {!input && hint ? (
        <Target show={hint.isInit} target={hint.hint} />
      ) : (
        <WaveLength isLocked={isLocked} hint={hint?.hint} />
      )}
    </>
  );
};
