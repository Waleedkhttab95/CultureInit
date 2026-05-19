import { hashPassword } from "./auth";

// Usage: npm run hash-password -- "your-strong-password"
// Paste the printed value into the ADMIN_PASSWORD_HASH env var.
const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-strong-password"');
  process.exit(1);
}

if (password.length < 10) {
  console.error("Refusing: choose a password of at least 10 characters.");
  process.exit(1);
}

console.log(hashPassword(password));
