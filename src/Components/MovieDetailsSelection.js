export function MovieDetailsSelection({ movie, onDeleteMovie }) {
  return (
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <p>
        <button onClick={() => onDeleteMovie(movie.imdbID)}>x</button>
      </p>
    </div>
  );
}
