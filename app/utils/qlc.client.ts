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

export function requestWidgetStatus(id: number): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`QLC+API|getWidgetStatus|${id}`);
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

/**
 * Triggers a QLC+ widget to "blink" by sending 255 and then 0 after a delay.
 */
export function vcWidgetBlink(id: string, duration: number = 1000): void {
  if (!id) return;
  vcWidgetSetValue(id, "255");
  setTimeout(() => {
    vcWidgetSetValue(id, "0");
  }, duration);
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
    const widgetId = qlcConfigs[cmd];
    if (!widgetId) return;

    if (cmd.startsWith("correct-t")) {
      vcWidgetBlink(widgetId, 2000);
    } else if (cmd.startsWith("wrong-t")) {
      vcWidgetBlink(widgetId, 1000);
    } else if (cmd.startsWith("active-t")) {
      vcWidgetTriggerOnce(widgetId, "255");
    } else if (cmd === "active-off") {
      vcWidgetTriggerOnce(widgetId, "0");
    } else if (cmd === "clear-inputs") {
      // Handled in show.tsx, but can also be handled here if widgetIds are known
      vcWidgetTriggerOnce(widgetId, "0");
    } else {
      // Default to a simple trigger or blink?
      // User said "sends signals to the ids with the corresponding command"
      vcWidgetTriggerOnce(widgetId, "255");
    }
  });
}

const lastTriggerTime = new Map<string, number>();

/**
 * Triggers a QLC+ widget only if it hasn't been triggered in the last 200ms
 * to prevent double-firing from rapid state updates.
 */
export function vcWidgetTriggerOnce(id: string, value: string = "255"): void {
  const now = Date.now();
  const key = `${id}-${value}`;
  const lastTime = lastTriggerTime.get(key) || 0;
  if (now - lastTime > 200) {
    lastTriggerTime.set(key, now);
    vcWidgetSetValue(id, value);
  }
}
