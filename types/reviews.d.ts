interface Reviews {
  id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  users: { id: number; name: string };
  movies: { id: number; title: string };
}
