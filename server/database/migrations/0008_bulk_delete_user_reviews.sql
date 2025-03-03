-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE PROCEDURE delete_user_reviews(
    IN p_user_id uuid,
    INOUT deleted_count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM "reviews"
    WHERE "user_id" = p_user_id;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
END;
$$;
