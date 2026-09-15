import { execFileSync } from "node:child_process";

function run(script, args = []) {
  execFileSync(process.execPath, [script, ...args], { stdio: "inherit", env: process.env });
}

run("scripts/migrate.mjs");
for (const language of ["en", "ru", "uz"]) run("scripts/import-islamhouse.mjs", ["192525", language, "30"]);
