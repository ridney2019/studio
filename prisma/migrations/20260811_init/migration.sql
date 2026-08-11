-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."OwnerUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OwnerVerificationToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OwnerVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OwnerPasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OwnerPasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerUser_email_key" ON "public"."OwnerUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerVerificationToken_tokenHash_key" ON "public"."OwnerVerificationToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerPasswordResetToken_tokenHash_key" ON "public"."OwnerPasswordResetToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "public"."OwnerVerificationToken" ADD CONSTRAINT "OwnerVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."OwnerUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OwnerPasswordResetToken" ADD CONSTRAINT "OwnerPasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."OwnerUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
