import { execSync } from "node:child_process";

if (process.env.RUN_DB_SEED === "1") {
  console.log("RUN_DB_SEED=1 — exécution du seed sur la base configurée (Neon prod).");
  execSync("npm run db:seed", { stdio: "inherit" });
}
