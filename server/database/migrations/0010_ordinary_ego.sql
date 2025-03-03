ALTER TABLE "age_ratings" DROP CONSTRAINT "age_ratings_movies_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN "id_age_ratings" integer;--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_id_age_ratings_age_ratings_id_fk" FOREIGN KEY ("id_age_ratings") REFERENCES "public"."age_ratings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "age_ratings" DROP COLUMN "movies_id";