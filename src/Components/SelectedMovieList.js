import { MovieDetailsSelection } from "./MovieDetailsSelection";
import { MovieHeader } from "./MovieHeader";

export function SelectedMovieList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <MovieHeader movie={movie} />
          <MovieDetailsSelection movie={movie} onDeleteMovie={onDeleteMovie} />
        </li>
      ))}
    </ul>
  );
}
