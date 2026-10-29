// Run from the website repository: node scripts/dart/capture-incident.mjs /path/to/FEMA
// Chromium is headless. No desktop mouse, keyboard, window, or user browser is used.
import {
  cp,
  mkdtemp,
  mkdir,
  symlink,
  writeFile,
  readFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const source = resolve(process.argv[2] || "../../FEMA");
const work = await mkdtemp(join(tmpdir(), "dart-incident-"));
const output = resolve(
  process.env.DART_CAPTURE_OUTPUT || join(work, "captures"),
);
await mkdir(output, { recursive: true });
for (const item of [
  "app",
  "lib",
  "db",
  "public",
  "data",
  "scripts",
  "tests/helpers",
  "next.config.js",
  "package.json",
  "package-lock.json",
])
  await cp(join(source, item), join(work, item), { recursive: true });
await mkdir(join(work, ".capture-data"), { recursive: true });
const nextConfig = join(work, "next.config.js");
// The temporary copy and the shared dependency folder have / as their common root.
await writeFile(
  nextConfig,
  (await readFile(nextConfig, "utf8")).replace(
    "turbopack: { root: process.cwd() }",
    "turbopack: { root: '/' }",
  ),
);
// Bundlers wrap import.meta.url in a URL shim. Resolve SQL from the isolated
// source tree instead; SQL bytes and all business services stay unchanged.
for (const name of ["platform-baseline.js", "integration-migrations.js"]) {
  const path = join(work, "lib", name);
  let code = await readFile(path, "utf8");
  code = code.replace(
    /new URL\(\s*"(\.\.\/db\/[^"]+)",\s*import.meta.url,?\s*\)/g,
    (_, file) => `capturePath(process.cwd(),${JSON.stringify(file.slice(3))})`,
  );
  await writeFile(
    path,
    "import {resolve as capturePath} from 'node:path';\n" + code,
  );
}
await writeFile(
  join(work, "scripts/capture-server.js"),
  `import {PGlite} from '@electric-sql/pglite';
import {initialize} from '../lib/db.js';
import {resolve} from 'node:path';
process.env.BROWSER_TEST_DIR=resolve('.capture-data');
const db=new PGlite(resolve('.capture-data/database'));
await initialize(db,'development',true);
await db.close();
await import('./browser-server.js');`,
);
const route = join(work, "app/api/readiness/route.js");
await writeFile(
  route,
  (await readFile(route, "utf8")).replace(
    "} catch (e) {",
    "} catch (e) { console.error(e);",
  ),
);
await symlink(join(source, "node_modules"), join(work, "node_modules"), "dir");
await mkdir(join(work, "tests/browser"), { recursive: true });
await cp(
  new URL("./incident-capture.spec.mjs", import.meta.url),
  join(work, "tests/browser/incident-capture.spec.js"),
);
await writeFile(
  join(work, "playwright.capture.config.mjs"),
  `export default {testDir:'./tests/browser',testMatch:'incident-capture.spec.js',workers:1,timeout:240000,use:{baseURL:'http://127.0.0.1:3311',headless:true,viewport:{width:1440,height:1000},reducedMotion:'reduce'},webServer:{command:'node scripts/capture-server.js',url:'http://127.0.0.1:3311',timeout:120000,reuseExistingServer:false},reporter:'list'};`,
);
console.log("Isolated capture workspace:", work);
const result = await new Promise((yes, no) => {
  const child = spawn(
    process.execPath,
    [
      join(source, "node_modules/@playwright/test/cli.js"),
      "test",
      "--config",
      "playwright.capture.config.mjs",
    ],
    {
      cwd: work,
      stdio: "inherit",
      env: {
        ...process.env,
        DART_CAPTURE_OUTPUT: output,
        BROWSER_TEST_PORT: "3311",
        APP_ENV: "development",
        DATABASE_URL: "",
        EXERCISE_DATABASE_URL: "",
        VERCEL: "",
        DART_DISABLE_LOCAL_JOBS: "1",
        NEXT_DIST_DIR: ".next-test",
        NOTIFICATION_LIVE_ENABLED: "false",
        CALL_LIVE_ENABLED: "false",
      },
    },
  );
  child.once("error", no);
  child.once("exit", yes);
});
if (result !== 0) process.exit(result || 1);
const manifest = JSON.parse(
  await readFile(join(output, "capture-manifest.json"), "utf8"),
);
manifest.sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: source,
  encoding: "utf8",
}).trim();
manifest.sourceDirty = !!execFileSync("git", ["status", "--porcelain"], {
  cwd: source,
  encoding: "utf8",
}).trim();
manifest.synthetic = true;
manifest.fileLoaderCompatibility =
  "SQL files resolved from the isolated source tree; SQL and workflow rules unchanged.";
manifest.sourceFiles = {};
for (const file of [
  "app/operations-workspace.jsx",
  "app/equipment-workspace.jsx",
  "app/development-workspace.jsx",
  "app/globals.css",
  "app/responsive-layout.css",
  "app/workspace-spacing.css",
  "lib/operations.js",
  "lib/equipment.js",
  "lib/readiness.js",
  "lib/development.js",
  "lib/help-guides.js",
])
  manifest.sourceFiles[file] = createHash("sha256")
    .update(await readFile(join(work, file)))
    .digest("hex");
await writeFile(
  join(output, "capture-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Captured actual app screens:", output);
console.log(
  "The isolated workspace is retained for inspection; no saved user data was changed.",
);
