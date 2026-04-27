import { readFile } from "node:fs/promises";

const domain = "seamless.thefrenchartist.dev";
const indexHtml = await readFile("dist/index.html", "utf8");
const cname = (await readFile("dist/CNAME", "utf8")).trim();

if (cname !== domain) {
  throw new Error(`Expected dist/CNAME to contain ${domain}, found ${cname || "(empty)"}`);
}

if (indexHtml.includes("/seamless-tester/assets/")) {
  throw new Error("Build still contains the old /seamless-tester/ asset base.");
}

console.log("Build complete");
console.log(`- Output: dist/`);
console.log(`- Router: HashRouter (#/)`);
console.log(`- Custom domain: https://${domain}/`);
