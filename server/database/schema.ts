import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("enum", ["subscriber", "author", "admin"]);

export const users = table(
  "users",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: t.text("name").notNull(),
    email: t.text("email").notNull(),
    password: t.text("password").notNull(),
    role: rolesEnum().default("subscriber"),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp(),
    deletedAt: t.timestamp(),
  },
  (table) => {
    return {
      name: t.index('name_idx').on(table.email),
      emailIndex: t.uniqueIndex("email_idx").on(table.email),
    };
  }
);

export const userRatings = table("user_ratings", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: t.integer("user_id").references(() => users.id),
  moviesId: t.integer("movies_id").references(() => movies.id),
  content: t.integer("rating").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const comments = table("comments", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: t.integer("user_id").references(() => users.id),
  moviesId: t.integer("movies_id").references(() => movies.id),
  content: t.text("content").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const movies = table("movies", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  slug: t.text('name').notNull(),
  synopsis: t.text("synopsis").notNull(),
  duration: t.integer("duration").notNull(),
  date: t.date("release_date").notNull(),
  averageRating: t.integer("average_rating").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
}, (table) => {
  return {
    nameIndex: t.index('name_idx').on(table.name),
    slugIndex: t.uniqueIndex('slug_idx').on(table.name)
  }
});

export const genresRelation = table("genres_relation", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  genresId: t.integer("genres_id").references(() => genres.id),
  moviesId: t.integer("movies_id").references(() => movies.id),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const genres = table("genres", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const castsRelation = table("castsRelations", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  castsId: t.integer("casts_id").references(() => casts.id),
  moviesId: t.integer("movies_id").references(() => movies.id),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const casts = table("casts", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});

export const ageRatings = table("age_ratings", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  moviesId: t.integer("movies_id").references(() => movies.id),
  content: t.integer("content").notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp(),
});
