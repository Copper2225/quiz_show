import type { FC } from "react";
import { Label } from "~/components/ui/label";
import Select from "~/components/Select";
import { Button } from "~/components/ui/button";
import { Zap } from "lucide-react";


interface TeamConfig {
  correct: string;
  wrong: string;
  input: string;
  active: string;
}

interface Props {
  widgets: { value: string; label: string }[];
  teamName: string;
  config: TeamConfig;
  onUpdate: (type: keyof TeamConfig, id: string) => void;
  triggerQLC: (id: string) => void;
}

const TeamLight: FC<Props> = ({
  widgets,
  teamName,
  config,
  onUpdate,
  triggerQLC,
}) => {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold border-b pb-2">{teamName}</h2>
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className={"mb-2"}>Korrekt</Label>
          <Select
            options={widgets}
            label="Widget"
            name="k-t1"
            value={config.correct}
            onChange={(id) => onUpdate("correct", id)}
            className="w-full"
          />
        </div>
        <Button onClick={() => triggerQLC(config.correct)} disabled={!config.correct}>
          <Zap className="size-4 mr-2" /> Test
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className={"mb-2"}>Falsch</Label>
          <Select
            options={widgets}
            label="Widget"
            name="f-t1"
            value={config.wrong}
            onChange={(id) => onUpdate("wrong", id)}
            className="w-full"
          />
        </div>
        <Button onClick={() => triggerQLC(config.wrong)} disabled={!config.wrong}>
          <Zap className="size-4 mr-2" /> Test
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className={"mb-2"}>Eingabe</Label>
          <Select
            options={widgets}
            label="Widget"
            name="i-t1"
            value={config.input}
            onChange={(id) => onUpdate("input", id)}
            className="w-full"
          />
        </div>
        <Button onClick={() => triggerQLC(config.input)} disabled={!config.input}>
          <Zap className="size-4 mr-2" /> Test
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className={"mb-2"}>Dran</Label>
          <Select
            options={widgets}
            label="Widget"
            name="a-t1"
            value={config.active}
            onChange={(id) => onUpdate("active", id)}
            className="w-full"
          />
        </div>
        <Button onClick={() => triggerQLC(config.active)} disabled={!config.active}>
          <Zap className="size-4 mr-2" /> Test
        </Button>
      </div>
    </div>
  </div>);
}
  
export default TeamLight;