import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import StepSlider from "~/components/ui/stepSlider";
import type { WavelengthQuestion } from "~/types/adminTypes";

interface Props {
  question?: WavelengthQuestion;
}

const WavelengthBaseEdit = ({ question }: Props) => {
  const [useNumber, setUseNumber] = useState<boolean>(
    question?.config?.useNumber === true,
  );
  const [useRandom, setUseRandom] = useState<boolean>(
    question?.config?.random === true,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="_check_config.useNumber">1-10</Label>
          <Checkbox
            id="_check_config.useNumber"
            name="_check_config.useNumber"
            defaultChecked={question?.config.useNumber}
            checked={useNumber}
            onCheckedChange={(checked) => setUseNumber(!!checked)}
          />
        </div>

        {useNumber && (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="_check_config.random">Zufall</Label>
              <Checkbox
                id="_check_config.random"
                name="_check_config.random"
                defaultChecked={question?.config.random}
                checked={useRandom}
                onCheckedChange={(checked) => setUseRandom(!!checked)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="config.lowLabel">LowLabel</Label>
              <Input
                name="config.lowLabel"
                id="config.lowLabel"
                placeholder="Low"
                defaultValue={question?.config.lowLabel}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="config.highLabel">HighLabel</Label>
              <Input
                name="config.highLabel"
                id="config.highLabel"
                placeholder="High"
                defaultValue={question?.config.highLabel}
              />
            </div>
          </>
        )}
      </div>

      {!useRandom && useNumber && (
        <div className="flex-1 min-w-full">
          <Label>Wert</Label>
          <StepSlider
            name="config.numberAnswer"
            defaultValue={question?.config.numberAnswer ?? [5]}
          />
        </div>
      )}

      {!useNumber && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="config.answer">Emoji</Label>
            <Checkbox
              id="_check_config.emoji"
              name="_check_config.emoji"
              defaultChecked={question?.config.emoji}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="config.answer">Lösung</Label>
            <Input
              name="config.answer"
              id="config.answer"
              placeholder="Antwort eingeben..."
              defaultValue={question?.config.answer}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WavelengthBaseEdit;
