import { spawn } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, "build"], {
      cwd: root,
      env: { ...process.env, NEXT_OUTPUT: "standalone" },
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `Next.js build stopped by ${signal}`
            : `Next.js build exited with code ${code}`,
        ),
      );
    });
  });
}

async function copyRuntimeAssets() {
  const standalone = path.join(root, ".next", "standalone");
  const standaloneNext = path.join(standalone, ".next");
  const standalonePublic = path.join(standalone, "public");
  const standaloneStatic = path.join(standaloneNext, "static");

  await rm(standalonePublic, { force: true, recursive: true });
  await rm(standaloneStatic, { force: true, recursive: true });
  await mkdir(standaloneNext, { recursive: true });
  await cp(path.join(root, "public"), standalonePublic, { recursive: true });
  await cp(path.join(root, ".next", "static"), standaloneStatic, {
    recursive: true,
  });
}

await runBuild();
await copyRuntimeAssets();

console.log("\nVPS runtime prepared in .next/standalone");
console.log("Start it with: node .next/standalone/server.js");
