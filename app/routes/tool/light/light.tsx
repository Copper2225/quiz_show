import { type FC, useCallback, useEffect, useState } from "react";
import { QLCConnection } from "~/components/QLCConnection";
import { isConnected, vcWidgetSetValue } from "~/utils/qlc.client";
import { toast } from "sonner";
import TeamLight from "~/routes/tool/light/TeamLight";

const Light: FC = () => {
  const [widgets, setWidgets] = useState<{ value: string; label: string }[]>([]);
  const [teamConfigs, setTeamConfigs] = useState<Record<number, { correct: string; wrong: string; input: string; active: string }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qlc_team_lights");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse team lights from localStorage", e);
        }
      }
    }
    const defaultConfig = { correct: "", wrong: "", input: "", active: "" };
    return {
      1: { ...defaultConfig },
      2: { ...defaultConfig },
      3: { ...defaultConfig },
      4: { ...defaultConfig },
      5: { ...defaultConfig },
      6: { ...defaultConfig },
    };
  });

  useEffect(() => {
    localStorage.setItem("qlc_team_lights", JSON.stringify(teamConfigs));
  }, [teamConfigs]);

  const handleWidgetsUpdate = useCallback((newWidgets: { value: string; label: string }[]) => {
    setWidgets(newWidgets);
  }, []);

  const updateTeamConfig = (teamId: number, type: "correct" | "wrong" | "input" | "active", value: string) => {
    setTeamConfigs((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [type]: value,
      },
    }));
  };

  const triggerQLC = async (id: string) => {
    if (!id) {
      toast.error("Kein Widget ausgewählt");
      return;
    }
    if (!isConnected()) {
      toast.error("Nicht mit QLC+ verbunden");
      return;
    }
    try {
      vcWidgetSetValue(id, "255");
      toast.success("QLC Triggered");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Trigger fehlgeschlagen");
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lichtsteuerung</h1>
        <QLCConnection onWidgetsUpdate={handleWidgetsUpdate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((teamId) => (
          <TeamLight
            key={teamId}
            teamName={`Team ${teamId}`}
            widgets={widgets}
            config={teamConfigs[teamId]}
            onUpdate={(type, id) => updateTeamConfig(teamId, type, id)}
            triggerQLC={triggerQLC}
          />
        ))}
      </div>
    </div>
  );
};

export default Light;