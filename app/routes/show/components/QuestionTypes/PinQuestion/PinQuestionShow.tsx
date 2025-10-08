import React, { useMemo } from "react";
import ShowText from "~/routes/show/components/ShowText";
import type { PinData, PinQuestion } from "~/types/adminTypes";
import PinMap from "~/routes/show/components/QuestionTypes/PinQuestion/PinMap";

interface Props {
  question: PinQuestion;
  withHeader: boolean;
  showAnswer: boolean;
  answers: Map<string, { answer: string; time: Date }>;
  playerReveals: Map<string, boolean>;
}

export interface ShowPin extends PinData {
  show: boolean;
}

const PinQuestionShow = ({
  question,
  withHeader,
  showAnswer,
  answers,
  playerReveals,
}: Props) => {
  const pins = useMemo(() => {
    const pinMap: ShowPin[] = [];
    Array.from(answers).forEach(([teamName, { answer }]) => {
      try {
        const pin = {
          ...(JSON.parse(answer) as PinData),
          show: playerReveals.get(teamName) ?? false,
        };
        pinMap.push(pin);
      } catch (e) {
        console.error("Invalid pin JSON:", answer, e);
      }
    });
    return pinMap;
  }, [answers]);

  return (
    <div className={"flex flex-1 p-4 gap-4 overflow-hidden self-center"}>
      {(question.config as any)?.media?.mediaChecked && (
        <div
          className={
            "w-full content-center h-full p-5 rounded-3xl outline-gray-200 outline-4 -outline-offset-12"
          }
        >
          <img
            className={"h-full justify-self-center"}
            src={(question.config as any)?.media?.mediaFile}
            alt={"Media"}
          />
        </div>
      )}
      {!withHeader && !showAnswer && <ShowText>{question.prompt}</ShowText>}

      <PinMap
        image={question.config.image}
        correct={question.config.pin}
        pins={pins}
        showCorrect={showAnswer}
      />
    </div>
  );
};

export default PinQuestionShow;
