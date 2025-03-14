import { z } from "zod";
import slugify from "slugify";
import path from "path";
import { promises as fs } from "fs";

const singleMovieSchema = z.object({
  title: z.string().min(1, "Title can't be empty."),
  synopsis: z.string().min(1, "Synopsis can't be empty."),
  duration: z.number().min(1, "Duration must't be empty."),
  releaseDate: z.coerce.date(),
  ageRatingId: z.number().optional(),
  posterPath: z.string().optional(),

  // Optional array
  genres: z.array(z.number()).optional(),
  casts: z.array(z.number()).optional(),
});

const bodySchema = z.union([singleMovieSchema, z.array(singleMovieSchema)]);

export default defineEventHandler(async (event) => {
  try {
    const now = new Date();

    let moviesPayload: any;
    let posterFileName: string | null = null;
    const contentType = event.node.req.headers["content-type"] || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await readMultipartFormData(event);

      const titleField = formData?.find((item) => item.name === "title");
      const titleValue = titleField?.data.toString() || "";
      const slug = slugify(titleValue, { lower: true, strict: true });

      const posterField = formData?.find((item) => item.name === "poster");
      if (posterField) {
        const extension = path.extname(posterField.filename || "");
        posterFileName = `${slug}${extension}`;
        const destinationPath = path.resolve(
          "./public/posters/",
          posterFileName,
        );
        await fs.writeFile(destinationPath, posterField.data);
      }

      moviesPayload = {
        title: titleValue,
        synopsis:
          formData?.find((item) => item.name === "synopsis")?.data.toString() ||
          "",
        duration: Number(
          formData?.find((item) => item.name === "duration")?.data.toString(),
        ),
        releaseDate:
          formData
            ?.find((item) => item.name === "releaseDate")
            ?.data.toString() || "",
        ageRatingId: formData?.find((item) => item.name === "ageRatingId")
          ? Number(
              formData
                ?.find((item) => item.name === "ageRatingId")
                ?.data.toString(),
            )
          : undefined,
        // Assuming the client sends genres and casts as JSON strings.
        genres: formData?.find((item) => item.name === "genres")
          ? JSON.parse(
              formData
                ?.find((item) => item.name === "genres")
                ?.data.toString() || "[]",
            )
          : [],
        casts: formData?.find((item) => item.name === "casts")
          ? JSON.parse(
              formData
                ?.find((item) => item.name === "casts")
                ?.data.toString() || "[]",
            )
          : [],
        posterPath: posterFileName || undefined,
      };
      moviesPayload = singleMovieSchema.parse(moviesPayload);
      moviesPayload = [moviesPayload]; // Wraps in array
    } else {
      const parsed = await readBody(event);
      moviesPayload = Array.isArray(parsed) ? parsed : [parsed];
    }

    const movies = useToArray(moviesPayload);

    const dataToInsert = movies.map((movie) => {
      const slug = slugify(movie.title, { lower: true, strict: true });
      return {
        title: movie.title,
        slug: slug,
        synopsis: movie.synopsis,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        ageRatingId: movie.ageRatingId,
        posterPath: movie.posterPath,
        createdAt: now,
      };
    });

    const insertedMovies = await useDrizzle()
      .insert(tables.movies)
      .values(dataToInsert)
      .returning();

    const genresRelations: genresRelations[] = [];
    const castsRelations: castsRelations[] = [];

    movies.forEach((movie, index) => {
      const movieId = insertedMovies[index].id;
      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach((genreId: number) => {
          genresRelations.push({
            genresId: genreId,
            moviesId: movieId,
            createdAt: now,
          });
        });
      }
      if (movie.casts && movie.casts.length > 0) {
        movie.casts.forEach((castId: number) => {
          castsRelations.push({
            castsId: castId,
            moviesId: movieId,
            createdAt: now,
          });
        });
      }
    });

    if (genresRelations.length > 0) {
      await useDrizzle().insert(tables.genresRelation).values(genresRelations);
    }

    if (castsRelations.length > 0) {
      await useDrizzle().insert(tables.castsRelation).values(castsRelations);
    }

    return {
      success: true,
      movie: insertedMovies[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during movie creation.",
    };
  }
});
