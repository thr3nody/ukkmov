ALTER TABLE "reviews"
  DROP CONSTRAINT IF EXISTS "reviews_user_id_users_id_fk",
  DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";

TRUNCATE TABLE "users";

ALTER TABLE "users"
  ALTER COLUMN "id" DROP IDENTITY;

ALTER TABLE "users"
  ALTER COLUMN "id" SET DATA TYPE uuid
  USING gen_random_uuid();

ALTER TABLE "users"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "genres"
  ADD CONSTRAINT "genres_name_unique" UNIQUE("name");
