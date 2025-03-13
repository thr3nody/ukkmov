ALTER TABLE "movies" DROP CONSTRAINT "movies_age_rating_id_age_ratings_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_movies_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_age_rating_id_age_ratings_id_fk" FOREIGN KEY ("age_rating_id") REFERENCES "public"."age_ratings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movies_id_movies_id_fk" FOREIGN KEY ("movies_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;