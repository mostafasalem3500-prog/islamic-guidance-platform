import { execFileSync } from "node:child_process";

function run(script, args = []) {
  execFileSync(process.execPath, [script, ...args], { stdio: "inherit", env: process.env });
}

run("scripts/migrate.mjs");
run("scripts/import-islamhouse.mjs", ["192525", "ar", "30"]);
