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

export function connectQLC(host: string = "localhost:9999"): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
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

export function vcWidgetSetValue(id: string, value: string): void {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`${id}|${value}`);
  } else {
    throw new Error("QLC WebSocket not connected");
  }
}
