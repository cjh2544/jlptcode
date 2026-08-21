import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productionEnv = path.join(root, ".env.production");
const localEnv = path.join(root, ".env.local");
const localEnvBackup = path.join(root, ".env.local.__build_bak");

if (!fs.existsSync(productionEnv)) {
  console.error("[build] .env.production 이 없습니다. 운영 빌드용 환경파일을 먼저 만드세요.");
  process.exit(1);
}

const hadLocal = fs.existsSync(localEnv);
let restored = false;

if (hadLocal) {
  // next build 는 NODE_ENV=production 이어도 .env.local 이 .env.production 을 덮어쓴다.
  fs.renameSync(localEnv, localEnvBackup);
  console.log("[build] .env.local 을 잠시 치우고 .env.production 으로 빌드합니다.");
} else {
  console.log("[build] .env.production 으로 빌드합니다.");
}

const restoreLocal = () => {
  if (restored) return;
  restored = true;
  if (hadLocal && fs.existsSync(localEnvBackup)) {
    if (fs.existsSync(localEnv)) fs.unlinkSync(localEnv);
    fs.renameSync(localEnvBackup, localEnv);
    console.log("[build] .env.local 을 복구했습니다.");
  }
};

process.on("exit", restoreLocal);
process.on("SIGINT", () => {
  restoreLocal();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restoreLocal();
  process.exit(143);
});

const result = spawnSync(
  "npx",
  ["next", "build", "--webpack"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    shell: true,
  },
);

restoreLocal();
process.exit(result.status ?? 1);
