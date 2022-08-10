import { Builder } from "./Builder";

const watchFlag = process.argv.includes("--watch");
const devFlag = process.argv.includes("--dev");

const builder = new Builder({ watchFlag, devFlag });
builder.addBuildFile(["src/scripts/index.tsx"]);
builder.addStaticFile(["src/index.html"]);
builder.addStaticDir(["src/assets/images"]);

builder.build();
