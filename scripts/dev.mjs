import { spawn, spawnSync, execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { startPgServer } from "./pg-server.mjs";
import { findFreePort } from "./port-utils.mjs";

const sessionFile = path.resolve(process.cwd(), ".dev-session.json");
const nextLockFile = path.resolve(process.cwd(), ".next/dev/lock");
let nextProcess = null;
let pgServerInstance = null;
let isShuttingDown = false;

/**
 * Checks if a process with the given PID is alive.
 */
function isPidAlive(pid) {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether a given PID belongs to this ShikshaSetu project.
 * Strictly verifies the process command line or path to prevent killing unrelated processes.
 */
function isProjectProcess(pid) {
  if (!pid || pid <= 0 || pid === process.pid) return false;
  if (!isPidAlive(pid)) return false;

  try {
    const cwdNormalized = process.cwd().toLowerCase().replace(/\\/g, "/");
    let cmd = "";

    if (process.platform === "win32") {
      cmd = execSync(
        `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"], timeout: 3000 }
      );
    } else {
      cmd = execSync(`ps -p ${pid} -o args=`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
        timeout: 3000,
      });
    }

    const cmdNormalized = cmd.toLowerCase().replace(/\\/g, "/");
    return (
      cmdNormalized.includes(cwdNormalized) ||
      (cmdNormalized.includes("shikha setu") &&
        (cmdNormalized.includes("next") ||
          cmdNormalized.includes("dev.mjs") ||
          cmdNormalized.includes("pg-server.mjs")))
    );
  } catch {
    return false;
  }
}

/**
 * Safely terminates a process and its children if and only if it belongs to this project.
 */
function safelyTerminateProcess(pid, description = "process") {
  if (!pid || pid === process.pid) return;
  if (!isPidAlive(pid)) return;

  if (isProjectProcess(pid)) {
    console.log(`[DEV] Safely stopping existing ShikshaSetu ${description} (PID ${pid})...`);
    try {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        process.kill(pid, "SIGTERM");
      }
    } catch {}
  }
}

/**
 * Checks for and cleans up any stale processes or lockfiles from previous runs of this project.
 */
function cleanupStaleState() {
  // 1. Inspect .next/dev/lock
  if (fs.existsSync(nextLockFile)) {
    let stalePid = null;
    try {
      const fd = fs.openSync(nextLockFile, "r");
      const buf = Buffer.alloc(1024);
      const bytes = fs.readSync(fd, buf, 0, 1024, 0);
      fs.closeSync(fd);
      const content = buf.toString("utf8", 0, bytes).trim();
      if (content) {
        const info = JSON.parse(content);
        if (info && info.pid) {
          stalePid = info.pid;
        }
      }
    } catch {}

    if (stalePid) {
      if (isPidAlive(stalePid)) {
        safelyTerminateProcess(stalePid, "Next.js dev server");
        const start = Date.now();
        while (Date.now() - start < 600) {
          if (!isPidAlive(stalePid)) break;
        }
      }
    }

    // If lockfile still exists and process is dead, remove it
    if (fs.existsSync(nextLockFile)) {
      if (!stalePid || !isPidAlive(stalePid)) {
        try {
          fs.unlinkSync(nextLockFile);
          console.log("[DEV] Cleaned up stale .next/dev/lock file.");
        } catch {}
      }
    }
  }

  // 2. Inspect .dev-session.json from previous run
  if (fs.existsSync(sessionFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
      if (data.pgPid && isPidAlive(data.pgPid)) {
        safelyTerminateProcess(data.pgPid, "PGlite server");
      }
      if (data.nextPid && isPidAlive(data.nextPid)) {
        safelyTerminateProcess(data.nextPid, "Next.js dev server");
      }
      fs.unlinkSync(sessionFile);
    } catch {}
  }

  // 3. Check if default ports (5432 or 3000) are occupied by stale ShikshaSetu processes
  for (const port of [5432, 3000]) {
    try {
      if (process.platform === "win32") {
        const output = execSync(`netstat -ano | findstr :${port}`, {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "ignore"],
        });
        const lines = output.trim().split("\n");
        for (const line of lines) {
          if (line.includes("LISTENING")) {
            const parts = line.trim().split(/\s+/);
            const portPid = parseInt(parts[parts.length - 1], 10);
            if (portPid && isProjectProcess(portPid)) {
              safelyTerminateProcess(portPid, `listener on port ${port}`);
            }
          }
        }
      }
    } catch {}
  }
}

// Graceful cleanup handler
function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("\n[DEV] Stopping ShikshaSetu development services...");

  // Clean up session file
  try {
    if (fs.existsSync(sessionFile)) {
      fs.unlinkSync(sessionFile);
    }
  } catch {}

  // Terminate Next.js child process
  if (nextProcess && nextProcess.pid) {
    try {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(nextProcess.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        nextProcess.kill("SIGTERM");
      }
    } catch {}
  }

  // Close PGlite PostgreSQL proxy server
  if (pgServerInstance) {
    try {
      pgServerInstance.close();
    } catch {}
  }

  setTimeout(() => process.exit(0), 200);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGHUP", cleanup);
process.on("exit", () => {
  try {
    if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
  } catch {}
});

async function main() {
  try {
    // 0. CLEANUP STALE PROCESSES & LOCKS FROM PREVIOUS RUNS
    cleanupStaleState();

    // 1. START PGLITE DATABASE WITH AUTOMATIC PORT DISCOVERY
    const preferredPgPort = process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432;
    const { port: pgPort, server } = await startPgServer(preferredPgPort);
    pgServerInstance = server;

    // 2. CONFIGURE DATABASE CONNECTION
    const dbUrl = `postgresql://postgres:postgres@127.0.0.1:${pgPort}/shikshasetu?schema=public&connection_limit=1&pgbouncer=true`;
    process.env.DATABASE_URL = dbUrl;

    // 3. FIND FREE NEXT.JS PORT
    console.log("\n[NEXT] Starting Next.js...");
    const preferredNextPort = process.env.NEXT_PORT || process.env.PORT || 3000;
    const nextPort = await findFreePort(preferredNextPort, "NEXT");
    const nextUrl = `http://localhost:${nextPort}`;

    // 4. EXPOSE RUNTIME ENVIRONMENT
    process.env.PORT = String(nextPort);
    process.env.NEXT_PORT = String(nextPort);
    process.env.NEXTAUTH_URL = nextUrl;
    process.env.NEXT_PUBLIC_APP_URL = nextUrl;

    // 5. PRINT CLEAN STARTUP SUMMARY
    console.log(`\n✓ ShikshaSetu ready`);
    console.log(`→ ${nextUrl}`);
    console.log(`[PG] PostgreSQL proxy: localhost:${pgPort}\n`);

    // 6. SPAWN NEXT.JS DEVELOPMENT PROCESS
    const nextBin = path.resolve("./node_modules/next/dist/bin/next");
    const stdinMode = process.stdin.isTTY ? "inherit" : "ignore";
    nextProcess = spawn(
      process.execPath,
      [nextBin, "dev", "--webpack", "-p", String(nextPort)],
      {
        stdio: [stdinMode, "inherit", "inherit"],
        env: {
          ...process.env,
          PORT: String(nextPort),
          NEXT_PORT: String(nextPort),
          NEXTAUTH_URL: nextUrl,
          NEXT_PUBLIC_APP_URL: nextUrl,
          DATABASE_URL: dbUrl,
        },
      }
    );

    // Write ephemeral session with PIDs for cleanup on next startup
    try {
      fs.writeFileSync(
        sessionFile,
        JSON.stringify(
          {
            pgPid: process.pid,
            nextPid: nextProcess.pid,
            pgPort,
            nextPort,
            nextUrl,
            databaseUrl: dbUrl,
          },
          null,
          2
        ),
        "utf8"
      );
    } catch {}

    nextProcess.on("error", (err) => {
      console.error("[NEXT Error]:", err.message);
      cleanup();
    });

    nextProcess.on("exit", (code) => {
      if (!isShuttingDown) {
        console.log(`[NEXT] Server stopped (code ${code})`);
        cleanup();
      }
    });
  } catch (err) {
    console.error("\n[Fatal Startup Error]:", err.message);
    cleanup();
  }
}

main();
