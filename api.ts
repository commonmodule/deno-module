import { serve as denoServe } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function serve(handler: (req: Request) => Promise<string | object>) {
  denoServe(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }
    try {
      const result = await handler(req);
      if (typeof result === "string") {
        return new Response(result, { headers: corsHeaders });
      } else {
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e: any) {
      return new Response(e.message, { status: 500, headers: corsHeaders });
    }
  });
}
