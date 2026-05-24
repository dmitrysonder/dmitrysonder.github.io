import { build } from "esbuild";
import { copyFile, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

const SRC = "src";
const OUT = ".";

// Clean previously generated artifacts at the repo root.
const rootEntries = await readdir(OUT);
for (const f of rootEntries) {
  if (f === "index.html" || f === "styles.css" || (extname(f) === ".js" && f !== "build.mjs")) {
    await unlink(join(OUT, f)).catch(() => {});
  }
}

const files = await readdir(SRC);
const jsxFiles = files.filter((f) => extname(f) === ".jsx");

await build({
  entryPoints: jsxFiles.map((f) => join(SRC, f)),
  outdir: OUT,
  loader: { ".jsx": "jsx" },
  bundle: false,
  minify: true,
  target: ["es2019"],
  logLevel: "info",
});

for (const f of files) {
  if (extname(f) === ".jsx") continue;
  if (f === "index.html") continue;
  await copyFile(join(SRC, f), join(OUT, f));
}

let html = await readFile(join(SRC, "index.html"), "utf8");
html = html
  .replace(/\s*<script[^>]*babel[^>]*><\/script>\s*/i, "\n")
  .replace(/react\.development\.js/g, "react.production.min.js")
  .replace(/react-dom\.development\.js/g, "react-dom.production.min.js")
  .replace(/(<script[^>]*react[^>]*?)\s+integrity="[^"]*"/g, "$1")
  .replace(/type="text\/babel"\s+src="([^"]+)\.jsx"/g, 'src="$1.js"');

await writeFile(join(OUT, "index.html"), html);

console.log(`Built ${jsxFiles.length} jsx files → repo root`);
