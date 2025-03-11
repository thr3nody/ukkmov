ALTER TABLE "movies" RENAME COLUMN "id_age_ratings" TO "age_rating_id";--> statement-breakpoint
ALTER TABLE "movies" DROP CONSTRAINT "movies_id_age_ratings_age_ratings_id_fk";
--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_age_rating_id_age_ratings_id_fk" FOREIGN KEY ("age_rating_id") REFERENCES "public"."age_ratings"("id") ON DELETE no action ON UPDATE no action;