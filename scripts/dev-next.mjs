import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { findFreePort } from "./port-utils.mjs";

async function runNext() {
  console.log("[NEXT] Starting Next.js...");
  const preferredPort = process.env.NEXT_PORT || process.env.PORT || 3000;
  const port = await findFreePort(preferredPort, "NEXT");
  const nextUrl = `http://localhost:${port}`;

  process.env.PORT = String(port);
  process.env.NEXT_PORT = String(port);
  process.env.NEXTAUTH_URL = nextUrl;
  process.env.NEXT_PUBLIC_APP_URL = nextUrl;

  // Check for ephemeral db session if available
  const sessionFile = path.resolve(process.cwd(), ".dev-session.json");
  if (fs.existsSync(sessionFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
      if (data.databaseUrl) {
        process.env.DATABASE_URL = data.databaseUrl;
      }
    } catch {}
  }

  console.log(`\n✓ Next.js ready`);
  console.log(`→ ${nextUrl}\n`);

  const nextBin = path.resolve("./node_modules/next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "dev", "--webpack", "-p", String(port)], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

runNext().catch((err) => {
  console.error("[NEXT Fatal Error]:", err.message);
  process.exit(1);
});
