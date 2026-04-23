import "dotenv/config";
import os from "os";
import app from "./app";

const PORT = process.env.PORT ?? 3001;

// Listen on all interfaces so devices on the same network can reach the API.
app.listen(Number(PORT), "0.0.0.0", () => {
  const localIp = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address ?? "<?>";

  console.log(`[server] Local:   http://localhost:${PORT}`);
  console.log(`[server] Network: http://${localIp}:${PORT}`);
  console.log(`[server] Docs:    http://${localIp}:${PORT}/docs`);
});
