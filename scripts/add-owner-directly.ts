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

const ownerEmailArg = process.argv[2];
const ownerPasswordArg = process.argv[3];
const ownerEmail = (ownerEmailArg || "nexostudiosltd@gmail.com").trim().toLowerCase();
const ownerPassword = ownerPasswordArg || "Nexos@@@2026";

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
