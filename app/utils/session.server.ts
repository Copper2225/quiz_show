// Server-only cookie utilities for storing the user's name using Remix cookies
import { createCookie } from "@remix-run/node";

const COOKIE_NAME = "qs_user";

const isProduction =
  typeof process !== "undefined" && process.env.NODE_ENV === "production";
const envCookieSecure = process.env.COOKIE_SECURE;
const cookieSecure =
  envCookieSecure !== undefined ? envCookieSecure === "true" : isProduction;

const userCookie = createCookie(COOKIE_NAME, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // 24 hours
  maxAge: 60 * 60 * 24,
  secure: cookieSecure,
});

export async function createUserCookie(name: string): Promise<string> {
  return userCookie.serialize(name);
}

export async function clearUserCookie(): Promise<string> {
  return userCookie.serialize("", { maxAge: 0 });
}

export async function getUserNameFromRequest(
  request: Request,
): Promise<string | undefined> {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userCookie.parse(cookieHeader)) || undefined;
  return cookie ?? undefined;
}
