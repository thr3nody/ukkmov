ALTER TABLE "castsRelations" RENAME TO "casts_relations";--> statement-breakpoint
ALTER TABLE "casts_relations" DROP CONSTRAINT "castsRelations_casts_id_casts_id_fk";
--> statement-breakpoint
ALTER TABLE "casts_relations" DROP CONSTRAINT "castsRelations_movies_id_movies_id_fk";
--> statement-breakpoint
ALTER TABLE "casts_relations" ADD CONSTRAINT "casts_relations_casts_id_casts_id_fk" FOREIGN KEY ("casts_id") REFERENCES "public"."casts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "casts_relations" ADD CONSTRAINT "casts_relations_movies_id_movies_id_fk" FOREIGN KEY ("movies_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;