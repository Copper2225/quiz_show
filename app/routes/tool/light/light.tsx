import { type FC, useCallback, useEffect, useState } from "react";
import { QLCConnection } from "~/components/QLCConnection";
import { isConnected, vcWidgetTriggerOnce } from "~/utils/qlc.client";
import { toast } from "sonner";
import TeamLight from "~/routes/tool/light/TeamLight";
import { useFetcher, useLoaderData } from "react-router";
import { AdminData } from "~/utils/playData.server";
import { Save, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Select from "~/components/Select";

export async function loader() {
  return {
    qlcConfigs: Object.fromEntries(AdminData.qlcConfigs),
  };
}

const Light: FC = () => {
  const { qlcConfigs: initialConfigs } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [widgets, setWidgets] = useState<{ value: string; label: string }[]>(
    [],
  );

  const [teamConfigs, setTeamConfigs] = useState<
    Record<
      number,
      { correct: string; wrong: string; input: string; active: string }
    >
  >(() => {
    const defaultConfig = { correct: "", wrong: "", input: "", active: "" };
    const teams = {
      1: { ...defaultConfig },
      2: { ...defaultConfig },
      3: { ...defaultConfig },
      4: { ...defaultConfig },
      5: { ...defaultConfig },
      6: { ...defaultConfig },
    };

    // Initialize from loaded configs if available
    Object.entries(initialConfigs).forEach(([key, widgetId]) => {
      const match = key.match(/^(correct|wrong|input|active)-t(\d+)$/);
      if (match) {
        const [, type, teamId] = match;
        const tid = parseInt(teamId);
        if (tid >= 1 && tid <= 6) {
          (teams as any)[tid][type] = widgetId;
        }
      }
    });

    return teams;
  });

  const [noSelectorInput, setNoSelectorInput] = useState<string>(
    initialConfigs["input-no-selector"] || "",
  );

  // Also check localStorage as fallback or override?
  // User asked for DB table, so DB should be primary.
  // Let's keep localStorage for now as a local cache but prefer DB on load.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qlc_team_lights");
      if (saved && Object.keys(initialConfigs).length === 0) {
        try {
          const parsed = JSON.parse(saved);
          // Only update if it's not the default empty state we just initialized
          if (Object.keys(parsed).length > 0) {
            setTeamConfigs(parsed);
          }
        } catch (e) {
          console.error("Failed to parse team lights from localStorage", e);
        }
      }
    }
  }, [initialConfigs]);

  useEffect(() => {
    localStorage.setItem("qlc_team_lights", JSON.stringify(teamConfigs));
  }, [teamConfigs]);

  const handleWidgetsUpdate = useCallback(
    (newWidgets: { value: string; label: string }[]) => {
      setWidgets(newWidgets);
    },
    [],
  );

  const updateTeamConfig = (
    teamId: number,
    type: "correct" | "wrong" | "input" | "active",
    value: string,
  ) => {
    setTeamConfigs((prev) => {
      const next = {
        ...prev,
        [teamId]: {
          ...prev[teamId],
          [type]: value,
        },
      };
      // Keep localStorage in sync
      localStorage.setItem("qlc_team_lights", JSON.stringify(next));
      return next;
    });
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
      vcWidgetTriggerOnce(id);
      toast.success("QLC Triggered");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Trigger fehlgeschlagen",
      );
    }
  };

  const saveConfigs = () => {
    const flatConfigs: Record<string, string> = {};
    Object.entries(teamConfigs).forEach(([teamId, config]) => {
      flatConfigs[`correct-t${teamId}`] = config.correct;
      flatConfigs[`wrong-t${teamId}`] = config.wrong;
      flatConfigs[`input-t${teamId}`] = config.input;
      flatConfigs[`active-t${teamId}`] = config.active;
    });
    flatConfigs["input-no-selector"] = noSelectorInput;

    fetcher.submit(
      { configs: JSON.stringify(flatConfigs) },
      { method: "post", action: "/api/qlcConfig" },
    );
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Konfiguration gespeichert");
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Lichtsteuerung</h1>
          <Button
            onClick={saveConfigs}
            disabled={fetcher.state !== "idle"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="size-4" /> Speichern
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border p-2 rounded-lg bg-muted/30">
            <Label className="whitespace-nowrap">Input (Kein Selector)</Label>
            <Select
              options={widgets}
              label="Widget"
              name="input-no-selector"
              value={noSelectorInput}
              onChange={setNoSelectorInput}
              className="w-48"
            />
            <Button
              size="sm"
              onClick={() => triggerQLC(noSelectorInput)}
              disabled={!noSelectorInput}
              variant="secondary"
            >
              <Zap className="size-4 mr-2" /> Test
            </Button>
          </div>
          <QLCConnection onWidgetsUpdate={handleWidgetsUpdate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((teamId) => (
          <TeamLight
            key={teamId}
            teamId={teamId}
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
