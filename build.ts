import { Builder } from "./Builder";

const watchFlag = process.argv.includes("--watch");
const devFlag = process.argv.includes("--dev");

const builder = new Builder({ watchFlag, devFlag });
builder.addBuildFile([]);
builder.addStaticFile([]);
builder.addStaticDir([]);

builder.build();
