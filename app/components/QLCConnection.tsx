import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Power, PowerOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  addQLCListener,
  connectQLC,
  disconnectQLC,
  isConnected,
  requestWidgetsList,
} from "~/utils/qlc.client";

interface QLCConnectionProps {
  onWidgetsUpdate?: (widgets: { value: string; label: string }[]) => void;
  hidden?: boolean;
}

export function QLCConnection({ onWidgetsUpdate, hidden }: QLCConnectionProps) {
  const [qlcHost, setQlcHost] = useState("127.0.0.1:9999");
  const [qlcConnected, setQlcConnected] = useState(false);

  useEffect(() => {
    setQlcConnected(isConnected());

    const removeListener = addQLCListener((data) => {
      const msgParams = data.split("|");
      if (msgParams[0] === "QLC+API") {
        if (msgParams[1] === "getWidgetsList") {
          const newWidgets: { value: string; label: string }[] = [];
          for (let i = 2; i < msgParams.length; i += 2) {
            newWidgets.push({
              value: msgParams[i],
              label: msgParams[i + 1],
            });
          }
          if (onWidgetsUpdate) {
            onWidgetsUpdate(newWidgets);
          }
        }
      }
    });

    return () => {
      removeListener();
    };
  }, [onWidgetsUpdate]);

  const handleConnect = async () => {
    try {
      await connectQLC(qlcHost);
      setQlcConnected(true);
      toast.success("Connected to QLC+");
      requestWidgetsList();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connection failed");
    }
  };

  const handleDisconnect = () => {
    disconnectQLC();
    setQlcConnected(false);
    toast.info("Disconnected from QLC+");
  };

  return (
    <div
      className={`flex gap-2 items-center border p-1 rounded-md ${hidden ? "opacity-0 bg-(--background) absolute w-fit mx-auto left-0 right-0 top-10 hover:opacity-100" : ""}`}
    >
      <Input
        placeholder={"127.0.0.1:9999"}
        value={qlcHost}
        onChange={(e) => setQlcHost(e.target.value)}
        className={"w-40"}
      />
      {!qlcConnected ? (
        <Button variant={"outline"} size={"sm"} onClick={handleConnect}>
          <Power className={"size-4 mr-2"} />
          Connect
        </Button>
      ) : (
        <Button variant={"destructive"} size={"sm"} onClick={handleDisconnect}>
          <PowerOff className={"size-4 mr-2"} />
          Disconnect
        </Button>
      )}
    </div>
  );
}
