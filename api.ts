import { serve as denoServe } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function serve(
  handler: (req: Request, ip: string | undefined) => Promise<string | object>,
) {
  denoServe(async (req, connInfo) => {
    if (req.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }

    const result = await handler(req, (connInfo.remoteAddr as any)?.hostname);
    if (typeof result === "string") {
      return new Response(result, { headers: corsHeaders });
    } else if (typeof result === "object") {
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(String(result), { headers: corsHeaders });
    }
  });
}
