// Server-only cookie utilities for storing the user's name

const COOKIE_NAME = "qs_user";

function serializeCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
  } = {},
): string {
  const segments: string[] = [];
  segments.push(`${name}=${encodeURIComponent(value)}`);
  segments.push(`Path=${options.path ?? "/"}`);
  if (typeof options.maxAge === "number") {
    segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.httpOnly ?? true) segments.push("HttpOnly");
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);
  if (
    options.secure ??
    (typeof process !== "undefined" && process.env.NODE_ENV === "production")
  ) {
    segments.push("Secure");
  }
  return segments.join("; ");
}

export function createUserCookie(name: string): string {
  return serializeCookie(COOKIE_NAME, name, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // 24 hours
    maxAge: 60 * 60 * 24,
  });
}

export function clearUserCookie(): string {
  return serializeCookie(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
}

export function getUserNameFromRequest(request: Request): string | undefined {
  const header = request.headers.get("Cookie");
  if (!header) return undefined;
  const parts = header.split(/;\s*/);
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1);
    if (key === COOKIE_NAME) {
      try {
        return decodeURIComponent(val);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}
