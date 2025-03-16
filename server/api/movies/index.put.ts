import slugify from "slugify";
import path from "path";
import { promises as fs } from "fs";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "PUT") {
    return { success: false, message: "Use PUT method for updating movies." };
  }

  try {
    const contentType = event.node.req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      throw new Error("Please send multipart/form-data!");
    }

    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw new Error("No form data provided.");
    }

    let movieId: number | null = null;
    let newPosterFileName: string | null = null;
    let wantNewPoster = false; // Do you want a new poster, babe? UwU
    const updates: Record<string, any> = {};

    for (const field of formData) {
      if (!field.name) continue;

      if (field.name === "id") {
        movieId = Number(field.data.toString());
      } else if (field.name === "poster") {
        wantNewPoster = true;
        const extension = path.extname(field.filename || "");
        const slug = slugify(
          formData.find((f) => f.name === "title")?.data.toString() ?? "movie",
          { lower: true, strict: true },
        );
        newPosterFileName = `${slug}${extension}`;
        updates.posterBuffer = field.data;
      } else if (field.name === "genres" || field.name === "casts") {
        updates[field.name] = JSON.parse(field.data.toString());
      } else {
        updates[field.name] = field.data.toString();
      }
    }

    if (!movieId) {
      throw new Error("No movie id provided.");
    }

    const oldMovie = await useDrizzle()
      .select({ posterPath: tables.movies.posterPath })
      .from(tables.movies)
      .where(eq(tables.movies.id, movieId))
      .execute();

    if (!oldMovie?.length) {
      throw new Error("Movie not found.");
    }
    const oldPosterPath = oldMovie[0].posterPath;

    if (wantNewPoster && oldPosterPath) {
      const oldPosterFullPath = path.resolve(
        "./public/posters/",
        oldPosterPath,
      );
      try {
        await fs.unlink(oldPosterFullPath);
      } catch (err) {
        console.warn("Could not remove old poster:", err);
      }
    }

    if (wantNewPoster && updates.posterBuffer && newPosterFileName) {
      const destPath = path.resolve("./public/posters/", newPosterFileName);
      await fs.writeFile(destPath, updates.posterBuffer);
      updates.posterPath = newPosterFileName;
    }

    const dataToUpdate: Record<string, any> = {
      title: updates.title ?? undefined,
      synopsis: updates.synopsis ?? undefined,
      duration: updates.duration ? Number(updates.duration) : undefined,
      releaseDate: updates.releaseDate
        ? new Date(updates.releaseDate)
        : undefined,
      ageRatingId: updates.ageRatingId
        ? Number(updates.ageRatingId)
        : undefined,
      trailerLink: updates.trailerLink ?? undefined,
      updatedAt: new Date(),
    };
    if (updates.posterPath) {
      dataToUpdate.posterPath = updates.posterPath; // This basically will only append a new poster path if a new one is being added, eh :D
    }

    const [updatedMovie] = await useDrizzle()
      .update(tables.movies)
      .set(dataToUpdate)
      .where(eq(tables.movies.id, movieId))
      .returning();

    if (!updatedMovie) {
      throw new Error("Failed to update movie or movie not found.");
    }

    return { success: true, movie: updatedMovie };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to update movie.",
    };
  }
});
