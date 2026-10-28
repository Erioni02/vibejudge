// Prints an ADMIN_PASSWORD_HASH value (scrypt) for the analytics dashboard.
// Usage: npm run admin:hash            (prompts; input is not echoed)
// The plain password is never written anywhere. Same format as lib/server/admin-auth.ts.
import { randomBytes, scrypt } from "node:crypto";
import { stdin, stdout } from "node:process";

const N = 2 ** 15;
const r = 8;
const p = 1;

function readHidden(prompt) {
  return new Promise((resolve) => {
    stdout.write(prompt);
    if (!stdin.isTTY) {
      let data = "";
      stdin.setEncoding("utf8");
      stdin.on("data", (chunk) => (data += chunk));
      stdin.on("end", () => resolve(data.replace(/\r?\n$/, "")));
      return;
    }
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", function onData(char) {
      if (char === "\r" || char === "\n" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (char === "\u0003") {
        process.exit(130);
      } else if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    });
  });
}

const password = await readHidden("Admin password (min 12 characters): ");
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
scrypt(password, salt, 64, { N, r, p, maxmem: 256 * 1024 * 1024 }, (error, key) => {
  if (error) throw error;
  console.log("\nADMIN_PASSWORD_HASH=" + `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${key.toString("base64")}`);
  console.log("ADMIN_SESSION_SECRET=" + randomBytes(32).toString("base64url"));
  console.log("\nPut both in your server environment (never with a NEXT_PUBLIC_ prefix).");
});
