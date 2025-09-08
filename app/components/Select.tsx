"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useCallback } from "react";

interface Props {
  options: { value: string; label: string }[];
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  align?: "center" | "start" | "end";
}

const Select = ({
  options,
  label,
  name,
  defaultValue,
  value: valueProp,
  onChange,
  className,
  align,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp !== undefined ? valueProp : internalValue;

  const change = useCallback(
    (val: string) => {
      if (valueProp === undefined) {
        setInternalValue(val);
      }
      if (onChange) {
        onChange(val);
      }
    },
    [onChange, valueProp],
  );

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={className}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : `Select ${label}...`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={className}
          style={{ width: "clamp(1000px, 100px, 2000px)" }}
          align={align}
        >
          <Command
            className={className}
            style={{ width: "clamp(1000px, 100px, 2000px)" }}
          >
            <CommandInput placeholder="Search ..." className="h-9" />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      change(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Select;
