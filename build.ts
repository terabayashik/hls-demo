import { Builder } from "./Builder";

const watchFlag = process.argv.includes("--watch");
const devFlag = process.argv.includes("--dev");

const builder = new Builder({ watchFlag, devFlag });
builder.addBuildFile(["src/scripts/index.tsx"]);
builder.addStaticFile(["src/pages/index.html"]);
builder.addStaticDir([]);

builder.build();
