import type { Route } from "./+types/sse.events";
import { eventStream } from "remix-utils/sse/server";
import { getUserNameFromRequest } from "~/utils/session.server";
import { addTeam, setAnswerType } from "~/utils/playData";

type Client = {
  id: string;
  name: string;
  send: (message: { event?: string; data: string }) => void;
};

declare global {
  // eslint-disable-next-line no-var
  var __sse_clients__: Map<string, Client> | undefined;
  // eslint-disable-next-line no-var
  var __sse_admin_id__: string | undefined;
}

const clients: Map<string, Client> = (globalThis.__sse_clients__ ||= new Map());
let adminId: string | undefined = (globalThis.__sse_admin_id__ ||= undefined);

function setAdmin(newAdminId: string | undefined) {
  adminId = newAdminId;
  globalThis.__sse_admin_id__ = adminId;
}

function broadcast(event: string, payload: unknown, excludeClientId?: string) {
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

function assignAdminIfNeeded() {
  if (!adminId && clients.size > 0) {
    const firstId = clients.keys().next().value as string | undefined;
    if (firstId) {
      setAdmin(firstId);
      const adminClient = clients.get(firstId);
      if (adminClient) {
        adminClient.send({ event: "role", data: "admin" });
      }
      broadcast(
        "admin-changed",
        { adminName: adminClient?.name ?? null },
        firstId,
      );
    }
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const userName = getUserNameFromRequest(request) ?? "Anonymous";

  if (getUserNameFromRequest(request)) {
    addTeam(userName);
  }

  return eventStream(request.signal, function setup(send) {
    const clientId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const client: Client = { id: clientId, name: userName, send };
    clients.set(clientId, client);

    // Initial role announcement for this client
    if (adminId === undefined) {
      setAdmin(clientId);
      send({ event: "role", data: "admin" });
      broadcast("admin-changed", { adminName: userName }, clientId);
    } else if (adminId === clientId) {
      send({ event: "role", data: "admin" });
    } else {
      send({ event: "role", data: "user" });
    }

    // Say hello to the new client and notify others about join
    send({ event: "hello", data: JSON.stringify({ name: userName }) });
    broadcast("joined", { name: userName }, clientId);

    return () => {
      const wasAdmin = adminId === clientId;
      clients.delete(clientId);
      broadcast("left", { name: userName });
      if (wasAdmin) {
        setAdmin(undefined);
        assignAdminIfNeeded();
      }
    };
  });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Accept either JSON or form-encoded bodies
  let message: string | undefined;
  let dataPayload: unknown | undefined;
  let eventName = "message";
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}) as any);
      message = typeof body.message === "string" ? body.message : undefined;
      if (typeof body.event === "string") eventName = body.event;
      if (body && typeof body.data !== "undefined") {
        if (typeof body.data === "string") {
          try {
            dataPayload = JSON.parse(body.data);
          } catch {
            dataPayload = body.data;
          }
        } else {
          dataPayload = body.data;
        }
      }
    } else {
      const form = await request.formData();
      const m = form.get("message");
      const e = form.get("event");
      const d = form.get("data");
      if (typeof m === "string") message = m;
      if (typeof e === "string") eventName = e;
      if (typeof d === "string") {
        try {
          dataPayload = JSON.parse(d);
        } catch {
          dataPayload = d;
        }
      }
    }
  } catch {}

  if (eventName === "answerType") {
    setAnswerType((dataPayload as any).type);
  }

  const name = getUserNameFromRequest(request) ?? "Anonymous";

  let senderId: string | undefined;
  for (const [id, c] of clients) {
    if (c.name === name) {
      senderId = id;
      break;
    }
  }

  if (typeof dataPayload !== "undefined") {
    broadcast(eventName, { from: name, data: dataPayload }, senderId);
  } else if (typeof message === "string") {
    broadcast(eventName, { from: name, message }, senderId);
  } else {
    broadcast(eventName, { from: name }, senderId);
  }
  return new Response(null, { status: 204 });
}
