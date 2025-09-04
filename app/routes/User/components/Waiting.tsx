import type { ReactElement } from "react";

const Waiting = (): ReactElement => {
  return (
    <div className={"p-4 h-full w-full flex justify-center"}>
      <span className={"self-center text-center text-gray-600"}>
        Warte auf Antwortmöglichkeiten...
      </span>
    </div>
  );
};

export default Waiting;
