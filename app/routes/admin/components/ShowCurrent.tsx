import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { useFetcher } from "react-router";
import { useCallback, useEffect } from "react";

interface Props {
  teamNames: string[];
  currentTeam: number;
  showCurrentSelector: boolean;
}

const ShowCurrent = ({
  teamNames,
  currentTeam,
  showCurrentSelector,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const fetcher = useFetcher();

  useEffect(() => {
    setValue(teamNames[currentTeam] ?? "");
  }, [currentTeam, teamNames]);

  const handleCheckChange = useCallback(() => {
    const formData = new FormData();
    formData.append("intent", "check");
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/selector",
    });
  }, []);

  const handleTeamSelect = useCallback(
    (currentValue: string) => {
      setValue(currentValue === value ? "" : currentValue);
      setOpen(false);
      const formData = new FormData();
      formData.append("intent", "select");
      formData.append(
        "team",
        teamNames
          .indexOf(currentValue === value ? "" : currentValue)
          .toString(),
      );
      fetcher.submit(formData, {
        method: "POST",
        action: "/api/selector",
      });
    },
    [teamNames],
  );

  return (
    <div>
      <Checkbox
        onCheckedChange={handleCheckChange}
        defaultChecked={showCurrentSelector}
        className={"me-3"}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value ? teamNames.find((team) => team === value) : "Wähle Team..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Suche Team..." className="h-9" />
            <CommandList>
              <CommandEmpty>Kein Team gefunden.</CommandEmpty>
              <CommandGroup>
                {teamNames.map((team) => (
                  <CommandItem
                    key={team}
                    value={team}
                    onSelect={handleTeamSelect}
                  >
                    {team}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === team ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShowCurrent;
