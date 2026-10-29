// Export only a completed, asserted headless run. No screenshot content is redrawn.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const folder = resolve(process.argv[2]);
const fema = resolve(process.argv[3] || "../../FEMA");
const require = createRequire(join(fema, "package.json"));
const sharp = require("sharp");
const manifest = JSON.parse(
  await readFile(join(folder, "capture-manifest.json"), "utf8"),
);
if (
  manifest.captures.length !== 12 ||
  !manifest.incidentId ||
  !manifest.deploymentId ||
  !manifest.radioId
)
  throw Error("A completed twelve-screen run is required.");
const destination = resolve("public/dart/walkthrough");
await mkdir(destination, { recursive: true });
for (const capture of manifest.captures) {
  const bytes = await sharp(join(folder, capture.name + ".png"))
    .webp({ quality: 92 })
    .toBuffer();
  await writeFile(join(destination, capture.name + ".webp"), bytes);
  capture.sha256 = createHash("sha256").update(bytes).digest("hex");
  capture.src = "/dart/walkthrough/" + capture.name + ".webp";
  const route = new URL(capture.url);
  capture.route = route.pathname + route.search;
  delete capture.url;
}
await writeFile(
  join(destination, "capture-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Exported 12 real app screenshots to", destination);
