/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MEMBER_ROLE" AS ENUM ('ADMIN', 'MODERATOR', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."CHANNEL_TYPE" AS ENUM ('TEXT', 'AUDIO', 'VIDEO');

-- DropForeignKey
ALTER TABLE "public"."Channel" DROP CONSTRAINT "Channel_profileID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Channel" DROP CONSTRAINT "Channel_serverID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_profileID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_serverID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Server" DROP CONSTRAINT "Server_profileID_fkey";

-- DropTable
DROP TABLE "public"."Channel";

-- DropTable
DROP TABLE "public"."Member";

-- DropTable
DROP TABLE "public"."Profile";

-- DropTable
DROP TABLE "public"."Server";

-- DropEnum
DROP TYPE "public"."ChannelType";

-- DropEnum
DROP TYPE "public"."MemberRole";

-- CreateTable
CREATE TABLE "public"."profile_tbl" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_tbl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."server_tbl" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "profileID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_tbl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."member_tbl" (
    "id" TEXT NOT NULL,
    "role" "public"."MEMBER_ROLE" NOT NULL DEFAULT 'GUEST',
    "profileID" TEXT NOT NULL,
    "serverID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_tbl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."channel_tbl" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CHANNEL_TYPE" NOT NULL DEFAULT 'TEXT',
    "profileID" TEXT NOT NULL,
    "serverID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_tbl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_tbl_userID_key" ON "public"."profile_tbl"("userID");

-- CreateIndex
CREATE INDEX "server_tbl_profileID_idx" ON "public"."server_tbl"("profileID");

-- CreateIndex
CREATE INDEX "member_tbl_profileID_idx" ON "public"."member_tbl"("profileID");

-- CreateIndex
CREATE INDEX "member_tbl_serverID_idx" ON "public"."member_tbl"("serverID");

-- CreateIndex
CREATE INDEX "channel_tbl_profileID_idx" ON "public"."channel_tbl"("profileID");

-- CreateIndex
CREATE INDEX "channel_tbl_serverID_idx" ON "public"."channel_tbl"("serverID");

-- AddForeignKey
ALTER TABLE "public"."server_tbl" ADD CONSTRAINT "server_tbl_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "public"."profile_tbl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."member_tbl" ADD CONSTRAINT "member_tbl_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "public"."profile_tbl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."member_tbl" ADD CONSTRAINT "member_tbl_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "public"."server_tbl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_tbl" ADD CONSTRAINT "channel_tbl_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "public"."profile_tbl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_tbl" ADD CONSTRAINT "channel_tbl_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "public"."server_tbl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
