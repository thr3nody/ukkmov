interface Movies {
  id: number;
  title: string;
  slug?: string;
  synopsis: string;
  duration: number;
  averageRating?: number;
  releaseDate: string;
  trailerLink: string;
  posterPath?: string;
  genres?: Array<{ id: number; name: string }>;
  casts?: Array<{ id: number; name: string }>;
  ageRating?: { id: number; content: string };
}
