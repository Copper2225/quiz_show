// Server-only cookie utilities for storing the user's name using Remix cookies
import { createCookie } from "@remix-run/node";

const COOKIE_NAME = "qs_user";

const userCookie = createCookie(COOKIE_NAME, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // 24 hours
  maxAge: 60 * 60 * 24,
  secure:
    typeof process !== "undefined" && process.env.NODE_ENV === "production",
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
