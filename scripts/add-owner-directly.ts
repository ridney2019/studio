import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) return;

    const key = match[1].trim();
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

// The e-mail and password are NEVER written in this file (the repository is public): they come from the command line or from the
// environment, and the script stops with a clear message when one is missing.
//   OWNER_PASSWORD='…' npx tsx scripts/add-owner-directly.ts owner@example.com
//   or: OWNER_EMAIL=owner@example.com OWNER_PASSWORD='…' npx tsx scripts/add-owner-directly.ts
// Prefer the OWNER_PASSWORD variable over a password argument (arguments stay in the shell history).
const ownerEmailRaw = process.argv[2] || process.env.OWNER_EMAIL;
const ownerPasswordRaw = process.argv[3] || process.env.OWNER_PASSWORD;

if (!ownerEmailRaw || !ownerPasswordRaw) {
  const missing = [!ownerEmailRaw ? "e-mail (argument 1 or OWNER_EMAIL)" : null, !ownerPasswordRaw ? "password (argument 2 or OWNER_PASSWORD)" : null].filter(Boolean).join(" and ");
  console.error(`Missing ${missing}. Nothing was changed.`);
  console.error("Usage: OWNER_PASSWORD='…' npx tsx scripts/add-owner-directly.ts <owner-email>");
  process.exit(1);
}
const ownerEmail: string = ownerEmailRaw.trim().toLowerCase();
const ownerPassword: string = ownerPasswordRaw;

async function addOwnerDirectly() {
  const { prisma } = await import("../lib/prisma");
  const { hashPassword } = await import("../lib/owner-auth");

  try {
    const passwordHash = await hashPassword(ownerPassword);

    const user = await prisma.ownerUser.upsert({
      where: { email: ownerEmail },
      update: {
        passwordHash,
        emailVerifiedAt: new Date(),
      },
      create: {
        email: ownerEmail,
        passwordHash,
        emailVerifiedAt: new Date(),
      },
    });

    console.log("Owner user added or updated successfully:");
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);
    console.log(`Verified: ${user.emailVerifiedAt ? "Yes" : "No"}`);
  } catch (error) {
    console.error("Failed to add owner user:", error);
    process.exit(1);
  }
}

void addOwnerDirectly();
