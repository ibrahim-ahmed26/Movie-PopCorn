import { MovieYear } from "./MovieYear";
import { MovieHeader } from "./MovieHeader";

export function MovieDetails({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <MovieHeader movie={movie} />
      <MovieYear movie={movie} />
    </li>
  );
}
