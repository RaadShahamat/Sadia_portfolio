#!/usr/bin/env node
/* =====================================================================
   Preview the website on your own computer.
     node tools/preview.mjs          -> http://localhost:8000
   1) refreshes the photo list from the /images folders
   2) starts a small local web server (no installs needed)
   Press Ctrl + C to stop.
   ===================================================================== */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 8000;

execFileSync(process.execPath, [join(ROOT, "tools", "build-photos.mjs")], { stdio: "inherit" });

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
  ".avif": "image/avif", ".pdf": "application/pdf", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8"
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const info = await stat(file).catch(() => null);
    const target = info && info.isFile() ? file : join(ROOT, "404.html");
    const body = await readFile(target);
    res.writeHead(info && info.isFile() ? 200 : 404, {
      "Content-Type": TYPES[extname(target).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => {
  console.log(`\nPreview running at  http://localhost:${PORT}\nPress Ctrl + C to stop.\n`);
});
