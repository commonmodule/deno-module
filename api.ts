import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function response(data: string | object) {
  if (typeof data === "string") {
    return new Response(data, { headers: corsHeaders });
  }
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export interface Context {
  request: Request;
  response: Response | undefined;
}

type Middleware = (ctx: Context) => Promise<void>;

export function startServer(...middlewares: Middleware[]) {
  serve(async (req) => {
    if (req.method === "OPTIONS") return response("ok");
    for (const middleware of middlewares) {
      const ctx = { request: req, response: undefined };
      await middleware(ctx);
      if (ctx.response) return ctx.response;
    }
    throw new Error("Not found");
  });
}
