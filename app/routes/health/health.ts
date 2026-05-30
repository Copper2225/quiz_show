import type { Route } from "./+types/health";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function loader(_args: Route.LoaderArgs) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
