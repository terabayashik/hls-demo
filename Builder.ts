import * as chokidar from "chokidar";
import { build, BuildOptions } from "esbuild";
import { promises as fs } from "fs";
import path from "path";

const distDir = "docs";

const distPath = (relPath: string) => {
  return path.join(distDir, relPath.replace("src", ""));
};

export class Builder {
  watchFlag: boolean;
  devFlag: boolean;
  buildFiles: string[];
  staticFiles: string[];
  staticDirs: string[];

  constructor(option: { watchFlag: boolean; devFlag: boolean }) {
    this.watchFlag = option.watchFlag;
    this.devFlag = option.devFlag;
    this.buildFiles = [];
    this.staticFiles = [];
    this.staticDirs = [];
  }

  addBuildFile(file: string | string[]) {
    if (typeof file === "string") {
      this.buildFiles.push(file);
    } else {
      this.buildFiles.push(...file);
    }
  }

  addStaticFile(file: string | string[]) {
    if (typeof file === "string") {
      this.staticFiles.push(file);
    } else {
      this.staticFiles.push(...file);
    }
  }

  addStaticDir(dir: string | string[]) {
    if (typeof dir === "string") {
      this.staticDirs.push(dir);
    } else {
      this.staticDirs.push(...dir);
    }
  }

  watchOption(): BuildOptions["watch"] {
    return this.watchFlag
      ? {
          onRebuild: (error, result) => {
            if (error) {
              console.error(`watch build failed:`, error);
            } else {
              console.log(`watch build succeeded:`, result);
            }
          },
        }
      : false;
  }

  async copyStaticFile(file: string) {
    await fs.mkdir(distPath(path.dirname(file)), { recursive: true });
    if (this.watchFlag) {
      chokidar.watch(file).on("all", (event, path) => {
        console.log(event, path);
        fs.copyFile(path, distPath(file));
      });
    } else {
      fs.copyFile(file, distPath(file));
    }
  }

  async copyStaticDir(dir: string) {
    await fs.mkdir(distPath(dir), { recursive: true });
    if (this.watchFlag) {
      chokidar.watch(path.join(dir, "*")).on("all", (event, filepath) => {
        console.log(event, filepath);
        fs.copyFile(
          filepath,
          distPath(path.join(dir, path.basename(filepath)))
        );
      });
    } else {
      fs.cp(dir, distPath(dir), { recursive: true });
    }
  }

  build() {
    for (const file of this.buildFiles) {
      build({
        entryPoints: [file],
        bundle: true,
        outdir: distPath(path.dirname(file)),
        watch: this.watchOption(),
        sourcemap: this.devFlag ? "inline" : false,
        minify: !this.devFlag,
      });
    }
    for (const file of this.staticFiles) {
      this.copyStaticFile(file);
    }
    for (const dir of this.staticDirs) {
      this.copyStaticDir(dir);
    }
  }
}
