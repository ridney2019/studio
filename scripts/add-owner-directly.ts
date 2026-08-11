import fs from "fs";
import path from "path";

// Load environment variables FIRST before any imports
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  line = line.trim();
  if (!line || line.startsWith("#")) return;
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
});

// NOW import Prisma and other modules after env is loaded
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/owner-auth";

async function addOwnerDirectly() {
  const email = "ridneygbs@gmail.com";
  const password = "Nexos@@@2026";

  try {
    console.log("Hashing password...");
    const passwordHash = await hashPassword(password);

    console.log("Adding user to database...");
    const user = await prisma.ownerUser.upsert({
      where: { email },
      update: {
        passwordHash,
        emailVerifiedAt: new Date(), // Mark as verified immediately
      },
      create: {
        email,
        passwordHash,
        emailVerifiedAt: new Date(), // Mark as verified immediately
      },
    });

    console.log("✅ Owner user added/updated successfully:");
    console.log("  Email:", user.email);
    console.log("  ID:", user.id);
    console.log("  Verified:", user.emailVerifiedAt ? "Yes" : "No");
    console.log("\nYou can now sign in at: https://www.nexotattooireland.com/admin");
  } catch (error) {
    console.error("❌ Failed to add owner user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addOwnerDirectly();
