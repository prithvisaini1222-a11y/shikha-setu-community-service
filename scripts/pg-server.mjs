import { PGlite } from "@electric-sql/pglite";
import { createServer } from "pglite-server";
import fs from "node:fs";
import { findFreePort } from "./port-utils.mjs";

export async function startPgServer(preferredPort = 5432) {
  console.log("[PG] Starting PGlite...");
  const dataDir = "./prisma/pgdata";
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Automatically remove stale postmaster.pid if present from previous unclean exit
  const pidFile = `${dataDir}/postmaster.pid`;
  if (fs.existsSync(pidFile)) {
    try {
      fs.unlinkSync(pidFile);
      console.log("[PG] Cleaned up stale postmaster.pid lock file.");
    } catch (e) {
      console.warn("[PG] Could not remove postmaster.pid:", e.message);
    }
  }

  const db = new PGlite(dataDir);
  await db.waitReady;

  // Serialize all execProtocol calls through a promise queue to prevent WASM concurrency errors
  let execQueue = Promise.resolve();
  const originalExecProtocol = db.execProtocol.bind(db);
  db.execProtocol = function (message) {
    const run = execQueue.then(() => originalExecProtocol(message));
    execQueue = run.catch(() => {});
    return run;
  };

  const startPort = process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : preferredPort;
  const port = await findFreePort(startPort, "PG");
  const server = createServer(db, { logLevel: 1 });

  await new Promise((resolve, reject) => {
    server.once("error", (err) => {
      console.error(`[PG Error] Failed to bind to port ${port}:`, err.message);
      reject(err);
    });
    server.listen(port, "0.0.0.0", () => {
      resolve();
    });
  });

  console.log(`[PG] PGlite ready at localhost:${port}`);
  console.log(`[PG] PostgreSQL proxy: localhost:${port}`);

  return { port, server, db };
}

// Standalone execution support
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, "/")) {
  startPgServer().catch((err) => {
    console.error("[PG Fatal Error]:", err.message);
    process.exit(1);
  });
}
