ALTER TABLE "casts_relations" DROP CONSTRAINT "casts_relations_casts_id_casts_id_fk";
--> statement-breakpoint
ALTER TABLE "casts_relations" DROP CONSTRAINT "casts_relations_movies_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "genres_relation" DROP CONSTRAINT "genres_relation_genres_id_genres_id_fk";
--> statement-breakpoint
ALTER TABLE "genres_relation" DROP CONSTRAINT "genres_relation_movies_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "casts_relations" ADD CONSTRAINT "casts_relations_casts_id_casts_id_fk" FOREIGN KEY ("casts_id") REFERENCES "public"."casts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "casts_relations" ADD CONSTRAINT "casts_relations_movies_id_movies_id_fk" FOREIGN KEY ("movies_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genres_relation" ADD CONSTRAINT "genres_relation_genres_id_genres_id_fk" FOREIGN KEY ("genres_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genres_relation" ADD CONSTRAINT "genres_relation_movies_id_movies_id_fk" FOREIGN KEY ("movies_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;