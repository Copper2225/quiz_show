import type { Route } from "./+types/sse.events";
import { eventStream } from "remix-utils/sse/server";
import { getUserNameFromRequest } from "~/utils/session.server";
import { addTeam } from "~/utils/playData.server";
import dot from "dot-object";

type Client = {
  id: string;
  name: string;
  send: (message: { event?: string; data: string }) => void;
};

declare global {
  // eslint-disable-next-line no-var
  var __sse_clients__: Map<string, Client> | undefined;
}

const clients: Map<string, Client> = (globalThis.__sse_clients__ ||= new Map());

export function broadcast(
  event: string,
  payload: unknown,
  excludeClientId?: string,
) {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  for (const [id, client] of clients) {
    if (excludeClientId && id === excludeClientId) continue;
    try {
      client.send({ event, data });
    } catch {
      // Ignore send errors; client cleanup will handle stale connections
    }
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const userName = (await getUserNameFromRequest(request)) ?? undefined;

  if (userName) {
    addTeam(userName);
  } else {
    return;
  }

  return eventStream(request.signal, function setup(send) {
    const clientId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const client: Client = {
      id: clientId,
      name: userName,
      send,
    };
    clients.set(clientId, client);

    return () => {
      clients.delete(clientId);
      broadcast("left", { name: userName });
    };
  });
}

export async function action({ request }: Route.LoaderArgs) {
  const formData = await request.formData();
  const plainForm = Object.fromEntries(formData.entries());
  const requestValues = dot.object(plainForm) as any;
  broadcast(requestValues.event, { data: requestValues.data });
}
