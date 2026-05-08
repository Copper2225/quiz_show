import { useEffect, useRef } from "react";
import { executeQLCCommand } from "~/utils/qlc.client";
import { useRevalidator } from "react-router";

/**
 * Hook to handle multiple SSE events and trigger QLC commands and revalidation.
 * 
 * @param qlcConfigs QLC configurations to map commands to widget IDs
 * @param events An array of event data (from useEventSource)
 */
export function useQLCCommands(
  qlcConfigs: Record<string, string>,
  events: (string | null)[],
) {
  const revalidate = useRevalidator();
  const lastProcessed = useRef<(string | null)[]>([]);

  useEffect(() => {
    // Synchronize lastProcessed array length with events array
    if (lastProcessed.current.length !== events.length) {
      lastProcessed.current = events.map((_, i) => lastProcessed.current[i] ?? null);
    }

    events.forEach((eventData, index) => {
      if (eventData && eventData !== lastProcessed.current[index]) {
        lastProcessed.current[index] = eventData;
        try {
          const payload = JSON.parse(eventData);

          if (payload.command) {
            executeQLCCommand(payload.command, qlcConfigs);
          }
          
          revalidate.revalidate();
        } catch (e) {
          // ignore parsing error for non-JSON payloads
          // but still revalidate if we received something
          revalidate.revalidate();
        }
      }
    });
  }, [events, qlcConfigs, revalidate]);
}
