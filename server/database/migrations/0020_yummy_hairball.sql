CREATE TABLE "countries_origin" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_origin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "countries_origin_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "countries_origin_relation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_origin_relation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"countries_origin_id" integer,
	"movies_id" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "countries_origin_relation" ADD CONSTRAINT "countries_origin_relation_countries_origin_id_countries_origin_id_fk" FOREIGN KEY ("countries_origin_id") REFERENCES "public"."countries_origin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries_origin_relation" ADD CONSTRAINT "countries_origin_relation_movies_id_movies_id_fk" FOREIGN KEY ("movies_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "country";