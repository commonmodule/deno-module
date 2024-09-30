import { exists } from "https://deno.land/std@0.223.0/fs/mod.ts";
import { serveFile } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { el } from "../page.ts";

Deno.serve(async (req) => {
  const basePath = Deno.cwd() + "/test";
  const path = new URL(req.url).pathname;
  const filePath = basePath + path;
  if (path !== "/" && await exists(filePath)) {
    return await serveFile(req, filePath);
  } else if (path === "/page-test") {
    return new Response(
      el("", el("h1", "Page Test")),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  } else {
    return await serveFile(req, basePath + "/index.html");
  }
});
