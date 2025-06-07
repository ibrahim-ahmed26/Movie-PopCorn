import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const apiKey = "7b9d26f7";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [watched, setWatched] = useState([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  function handleSelection(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function deleteSelection() {
    setSelectedId(null);
  }
  function handleMovieAdded(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const result = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
        );
        const data = await result.json();
        if (!result.ok) {
          throw new Error("Something Went Wrong");
        }
        if (data.Response === "False") {
          throw new Error("Move Not Found");
        }
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
  }, [query]);
  return (
    <>
      <NavBar>
        <SearchInput query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <ListedMovies movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <ListedMovies movies={movies} onSelectMovie={handleSelection} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieSelection
              selectedId={selectedId}
              onRemoveMovie={deleteSelection}
              onAddMovieToList={handleMovieAdded}
              watched={watched}
            />
          ) : (
            <>
              <MovieSummary watched={watched} />
              <SelectedMovieList
                watched={watched}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loading() {
  return (
    <div className="loading-container">
      <p className="loading">Loading...</p>
    </div>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚨</span>
      {message}
    </p>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchInput({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} onToggle={() => setIsOpen((o) => !o)} />
      {isOpen && children}
    </div>
  );
}

function ToggleButton({ isOpen, onToggle }) {
  return (
    <button className="btn-toggle" onClick={onToggle}>
      {isOpen ? "–" : "+"}
    </button>
  );
}

function ListedMovies({ movies, onSelectMovie }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <MovieDetails
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </ul>
    </>
  );
}

function MovieDetails({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <MovieHeader movie={movie} />
      <MovieYear movie={movie} />
    </li>
  );
}
function MovieHeader({ movie }) {
  return (
    <>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
    </>
  );
}
function MovieYear({ movie }) {
  return (
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  );
}
function MovieSummary({ watched }) {
  return (
    <div className="summary">
      <MovieSummaryHeader />
      <MovieSummaryList watched={watched} />
    </div>
  );
}
function MovieSummaryHeader() {
  return <h2>Movies you watched</h2>;
}
function MovieSelection({
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
    },
    [title]
  );
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

function MovieSummaryList({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  );
}
function SelectedMovieList({ watched, onDeleteMovie }) {
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
function MovieDetailsSelection({ movie, onDeleteMovie }) {
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
