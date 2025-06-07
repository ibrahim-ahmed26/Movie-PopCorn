import { useState, useEffect } from "react";
import { apiKey } from "./App";
import { Loading } from "./Loading";
import StarRating from "./StarRating";

export function MovieSelection({
  selectedId,
  onRemoveMovie,
  onAddMovieToList,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Actors: actors,
    Poster,
    Genre: genre,
    Plot: plot,
    Released: released,
    Year: year,
    imdbRating,
    Writer: writer,
    Runtime: runtime,
  } = movie;
  function handleAdd() {
    const alreadyAdded = watched.some((movie) => movie.imdbID === selectedId);
    if (alreadyAdded) {
      console.log("Return");
      return;
    }
    const newWatchedMovie = {
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      title,
      year,
      Poster,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddMovieToList(newWatchedMovie);
    onRemoveMovie();
  }
  useEffect(() => {
    try {
      async function fetchMovie() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Falied To Fetch");
        }
        setMovie(data);
      }
      fetchMovie();
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedId]);
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie: ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onRemoveMovie();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRemoveMovie]);
  return (
    <div className="box movie-selection">
      {loading ? (
        <Loading />
      ) : (
        <>
          <button className="btn-back" onClick={onRemoveMovie}>
            🔙 Back
          </button>
          <div className="selection-body">
            <img
              className="selection-poster"
              src={Poster}
              alt={`${title} poster`}
            />
            <div className="selection-details">
              <h2 className="selection-title">
                {title} ({year})
              </h2>
              <p>
                <strong>🎭 Genre:</strong> {genre}
              </p>
              <p>
                <strong>🗓 Released:</strong> {released}
              </p>
              <p>
                <strong>⭐ IMDb Rating:</strong> {imdbRating}
              </p>
              <div className="user-rating">
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                  color="#f9a825"
                />
              </div>

              {isWatched ? (
                <p>You Already Rated This Movie {watchedUserRating} ⭐️</p>
              ) : (
                userRating > 0 && (
                  <button onClick={handleAdd} className="btn-add-success">
                    Add To List
                  </button>
                )
              )}
              <p>
                <strong>👨‍🎤 Actors:</strong> {actors}
              </p>
              <p>
                <strong>✍ Writer:</strong> {writer}
              </p>
              <p>
                <strong>📝 Plot:</strong> {plot}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
