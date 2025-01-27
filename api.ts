import { serve as denoServe } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function serve(
  handler: (
    req: Request,
    ip: string | undefined,
  ) => string | object | void | Promise<string | object | void>,
) {
  denoServe(async (req, connInfo) => {
    if (req.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }

    let ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    if (!ip) ip = (connInfo.remoteAddr as any)?.hostname ?? "";

    // IPv6 to IPv4
    if (ip!.substring(0, 7) === "::ffff:") {
      ip = ip!.substring(7);
    }

    const result = await handler(req, ip!);
    if (typeof result === "string") {
      return new Response(result, { headers: corsHeaders });
    } else if (typeof result === "object") {
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (result !== undefined && result !== null) {
      return new Response(String(result), { headers: corsHeaders });
    } else {
      return new Response("", { headers: corsHeaders });
    }
  });
}
