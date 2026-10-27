// Local dev helper: starts a throwaway MongoDB (replica set) without Docker.
// Prefer `docker compose up mongo` when Docker is available.
import { MongoMemoryReplSet } from "mongodb-memory-server";
const rs = await MongoMemoryReplSet.create({ replSet: { count: 1 }, instanceOpts: [{ port: 27017 }] });
console.log("MongoDB ready:", rs.getUri("wellguardians"));
process.on("SIGINT", async () => { await rs.stop(); process.exit(0); });
setInterval(() => {}, 1 << 30);
