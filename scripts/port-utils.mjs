import net from "node:net";

/**
 * Checks whether a given TCP port is available on localhost and all interfaces.
 * Uses a robust dual-check:
 * 1. Checks if any process is actively accepting connections on 127.0.0.1 or ::1
 * 2. Attempts to bind a temporary TCP server to test listen availability
 * @param {number} port
 * @returns {Promise<boolean>}
 */
export function isPortAvailable(port) {
  return new Promise((resolve) => {
    // 1. Try to connect to 127.0.0.1. If it connects, port is definitely occupied.
    const client = net.createConnection({ port, host: "127.0.0.1" });
    client.setTimeout(250);

    client.once("connect", () => {
      client.destroy();
      resolve(false); // Port is occupied!
    });

    client.once("error", () => {
      // 2. Try listening on the port
      const server = net.createServer();
      server.unref();

      server.once("error", () => {
        resolve(false); // Cannot bind, port is occupied or restricted!
      });

      server.once("listening", () => {
        server.close(() => {
          resolve(true); // Port is free!
        });
      });

      server.listen(port);
    });

    client.once("timeout", () => {
      client.destroy();
      // On timeout, fallback to listen attempt
      const server = net.createServer();
      server.unref();

      server.once("error", () => {
        resolve(false);
      });

      server.once("listening", () => {
        server.close(() => {
          resolve(true);
        });
      });

      server.listen(port);
    });
  });
}

/**
 * Automatically finds the next available free port starting from startPort.
 * @param {number} startPort - The preferred starting port
 * @param {string} serviceName - e.g. "PG" or "NEXT"
 * @param {number} maxAttempts - Maximum subsequent ports to scan
 * @returns {Promise<number>} - The free port found
 */
export async function findFreePort(startPort, serviceName = "PORT", maxAttempts = 50) {
  let port = parseInt(startPort, 10);
  for (let i = 0; i < maxAttempts; i++) {
    const available = await isPortAvailable(port);
    if (available) {
      if (i > 0) {
        console.log(`[${serviceName}] Using free port ${port}.`);
      }
      return port;
    }
    console.log(`[${serviceName}] Port ${port} is busy.`);
    port++;
  }
  throw new Error(`[${serviceName}] Could not find an available port in range ${startPort}-${port - 1}`);
}
