ALTER TABLE "reviews" RENAME COLUMN "movies_id" TO "movie_id";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_movies_id_movies_id_fk";
--> statement-breakpoint
DROP INDEX "user_movie_index";--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_movie_index" ON "reviews" USING btree ("user_id","movie_id");