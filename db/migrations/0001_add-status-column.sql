CREATE TYPE "public"."campaign_status" AS ENUM('inactive', 'active', 'paused', 'completed');--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "prompt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "status" "campaign_status" DEFAULT 'inactive' NOT NULL;