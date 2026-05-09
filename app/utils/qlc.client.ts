type QLCMessageCallback = (data: string) => void;

let socket: WebSocket | null = null;
let callbacks: Set<QLCMessageCallback> = new Set();

export function isConnected(): boolean {
  return socket !== null && socket.readyState === WebSocket.OPEN;
}

export function addQLCListener(callback: QLCMessageCallback) {
  callbacks.add(callback);
  return () => {
    callbacks.delete(callback);
  };
}

export function connectQLC(host: string = "127.0.0.1:9999"): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      resolve();
      return;
    }

    const url = `ws://${host}/qlcplusWS`;
    socket = new WebSocket(url);

    socket.onopen = () => {
      resolve();
    };

    socket.onmessage = (event) => {
      const data = event.data as string;
      if (data.startsWith("QLC+API|getWidgetStatus|")) {
        const parts = data.split("|");
        const widgetId = parts[2];
        const status = parts[3];
        if (status === "255") {
          vcWidgetSetValue(widgetId, "255");
        }
      }
      callbacks.forEach((cb) => cb(event.data));
    };

    socket.onerror = (error) => {
      console.error("QLC WebSocket error:", error);
      reject(new Error("Failed to connect to local QLC WebSocket"));
    };

    socket.onclose = () => {
      socket = null;
    };
  });
}

export function disconnectQLC() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function sendQLCCommand(id: string, value: string): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`CH|${id}|${value}`);
  } else {
    throw new Error("QLC WebSocket not connected");
  }
}

export function requestWidgetsList(): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send("QLC+API|getWidgetsList");
  } else {
    throw new Error("QLC WebSocket not connected");
  }
}

export function vcWidgetSetValue(id: string, value: string): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`${id}|${value}`);
  } else {
    throw new Error("QLC WebSocket not connected");
  }
}

export function requestWidgetStatus(id: string): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`QLC+API|getWidgetStatus|${id}`);
  } else {
    throw new Error("QLC WebSocket not connected");
  }
}

/**
 * Executes a QLC command string like "correct-t1" or an array of such strings.
 * Uses the provided qlcConfigs to map commands to widget IDs.
 */
export function executeQLCCommand(
  command: string | string[],
  qlcConfigs: Record<string, string>,
): void {
  if (!isConnected()) return;

  const commands = Array.isArray(command) ? command : [command];

  commands.forEach((cmd) => {
    const values = cmd.split(";");
    const commandName = values[0];
    const value = values[1];
    const widgetId = qlcConfigs[commandName];
    if (!widgetId) return;

    if (value === "-1") {
      requestWidgetStatus(widgetId);
    } else {
      vcWidgetSetValue(widgetId, value);
    }
  });
}
