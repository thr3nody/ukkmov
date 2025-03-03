ALTER TABLE "reviews"
  DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";

TRUNCATE TABLE "reviews";

ALTER TABLE "reviews"
  ALTER COLUMN "user_id" DROP DEFAULT;

ALTER TABLE "reviews"
  ALTER COLUMN "user_id" SET DATA TYPE uuid
  USING gen_random_uuid();

ALTER TABLE "reviews"
  ALTER COLUMN "user_id" SET DEFAULT gen_random_uuid();

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id");
