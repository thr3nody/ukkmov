CREATE UNIQUE INDEX "user_movie_index" ON "reviews" USING btree ("user_id","movies_id");