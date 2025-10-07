import type { Route } from "./+types/sse.events";
import { eventStream } from "remix-utils/sse/server";

type Client = {
  id: string;
  send: (message: { event?: string; data: string }) => void;
};

declare global {
  // eslint-disable-next-line no-var
  var __sse_admin_client__: Client | undefined;
}

let client: Client | undefined = (globalThis.__sse_admin_client__ ||=
  undefined);

export function sendToAdmin(event: string, payload: unknown) {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  console.log(data, client);
  if (client) {
    try {
      client.send({ event, data });
    } catch {
      // Ignore send errors; client cleanup will handle stale connections
    }
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    const clientId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    client = {
      id: clientId,
      send,
    };

    return () => {
      client = undefined;
    };
  });
}
