-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_movie_avg_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE "movies"
      SET "average_rating" = (
        SELECT AVG(("rating")::text::int)
        FROM "reviews"
        WHERE "movie_id" = OLD."movie_id"
      )
    WHERE "id" = OLD."movie_id";

    RETURN OLD;
  ELSE
    UPDATE "movies"
      SET "average_rating" = (
        SELECT AVG(("rating")::text::int)
        FROM "reviews"
        WHERE "movies_id" = NEW."movie_id"
      )
    WHERE "id" = NEW."movie_id";

    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS reviews_avg_rating_trigger ON "reviews"; -- Drop if exist

CREATE TRIGGER reviews_avg_rating_trigger -- Create safely
AFTER INSERT OR UPDATE OR DELETE
ON "reviews"
FOR EACH ROW
EXECUTE PROCEDURE update_movie_avg_rating();
