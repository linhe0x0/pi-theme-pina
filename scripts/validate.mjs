// Validates themes/*.json against pi's published theme schema.
// The validator comes from @earendil-works/pi-coding-agent (devDependency). Its exports map does
// not expose the schema module, so import the installed file directly from node_modules.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const schemaPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "node_modules",
  "@earendil-works",
  "pi-coding-agent",
  "dist",
  "modes",
  "interactive",
  "theme",
  "theme-schema.js"
);

let validateThemeJson;
try {
  ({ validateThemeJson } = await import(pathToFileURL(schemaPath).href));
} catch {
  console.error("Could not load @earendil-works/pi-coding-agent. Run `npm install` first.");
  process.exit(1);
}

const themesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "themes");
const files = (await readdir(themesDir)).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error(`No theme files found in ${themesDir}`);
  process.exit(1);
}

let failed = false;
for (const file of files) {
  const json = JSON.parse(await readFile(path.join(themesDir, file), "utf8"));
  try {
    validateThemeJson(file, json);
    // Pi resolves the user theme by <name>.json, so the filename must match the theme name.
    if (json.name !== path.basename(file, ".json")) {
      throw new Error(`theme name "${json.name}" must match filename (expected "${json.name}.json")`);
    }
    console.log(`OK   ${file} (${json.name})`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${file}\n${error.message}`);
  }
}
process.exit(failed ? 1 : 0);
