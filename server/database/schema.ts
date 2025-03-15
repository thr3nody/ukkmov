import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles_enum", [
  "subscriber",
  "author",
  "admin",
]);
export const ratingsEnum = pgEnum("ratings_enum", ["1", "2", "3", "4", "5"]);

export const users = table(
  "users",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    name: t.text("name").notNull(),
    email: t.text("email").notNull(),
    password: t.text("password").notNull(),
    role: rolesEnum().default("subscriber").notNull(),
    avatarPath: t.text("avatar_path"),
    createdAt: t.timestamp("created_at").notNull(),
    updatedAt: t.timestamp("updated_at"),
    deletedAt: t.timestamp("deleted_at"),
  },
  (table) => {
    return {
      nameIndex: t.index("name_idx").on(table.name),
      emailIndex: t.uniqueIndex("email_idx").on(table.email),
    };
  },
);

export const reviews = table(
  "reviews",
  {
    id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: t
      .uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" }),
    movieId: t
      .integer("movie_id")
      .references(() => movies.id, { onDelete: "cascade" }),
    rating: ratingsEnum().notNull(),
    comment: t.text("comment"),
    createdAt: t.timestamp("created_at").notNull(),
    updatedAt: t.timestamp("updated_at"),
  },
  (table) => {
    return {
      userMoviesIndex: t
        .uniqueIndex("user_movie_index")
        .on(table.userId, table.movieId),
    };
  },
);

export const movies = table(
  "movies",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    ageRatingId: t
      .integer("age_rating_id")
      .references(() => ageRatings.id, { onDelete: "set null" }),
    title: t.text("title").notNull(),
    slug: t.text("slug").notNull(),
    synopsis: t.text("synopsis").notNull(),
    duration: t.integer("duration").notNull(),
    releaseDate: t.timestamp("release_date", { withTimezone: false }).notNull(),
    averageRating: t.decimal("average_rating"),
    trailerLink: t.text("trailer_link"),
    posterPath: t.text("poster_path"),
    createdAt: t.timestamp("created_at").notNull(),
    updatedAt: t.timestamp("updated_at"),
  },
  (table) => {
    return {
      titleIndex: t.index("title_idx").on(table.title),
      slugIndex: t.uniqueIndex("slug_idx").on(table.slug),
    };
  },
);

export const genresRelation = table("genres_relation", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  genresId: t.integer("genres_id").references(() => genres.id, {
    onDelete: "cascade",
  }),
  moviesId: t.integer("movies_id").references(() => movies.id, {
    onDelete: "cascade",
  }),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at"),
});

export const genres = table("genres", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull().unique(),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at"),
});

export const castsRelation = table("casts_relations", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  castsId: t.integer("casts_id").references(() => casts.id, {
    onDelete: "cascade",
  }),
  moviesId: t.integer("movies_id").references(() => movies.id, {
    onDelete: "cascade",
  }),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at"),
});

export const casts = table("casts", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at"),
});

export const ageRatings = table("age_ratings", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: t.text("content").notNull(),
  createdAt: t.timestamp("created_at").notNull(),
  updatedAt: t.timestamp("updated_at"),
});
