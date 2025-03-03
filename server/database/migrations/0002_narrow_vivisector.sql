ALTER TABLE "movies" RENAME COLUMN "name" TO "slug";--> statement-breakpoint
DROP INDEX "slug_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "movies" USING btree ("slug");