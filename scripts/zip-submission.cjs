const { execFileSync } = require("child_process");
const { unlinkSync, existsSync } = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "task-assignment.zip");

const excludes = [
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".git",
  "task-assignment.zip",
  ".DS_Store",
  "*.db",
  "*.db-wal",
  "*.db-shm",
  ".env",
  ".env.*",
];

if (existsSync(out)) {
  unlinkSync(out);
}

const args = ["-a", "-c", "-f", out];
for (const pattern of excludes) {
  args.push("--exclude", pattern);
}
args.push(".");

execFileSync("tar", args, { cwd: root, stdio: "inherit" });
console.log(`Created ${out}`);
