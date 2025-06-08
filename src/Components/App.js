import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { ErrorMessage } from "./ErrorMessage";
import { NavBar } from "./NavBar";
import { SearchInput } from "./SearchInput";
import { NumResults } from "./NumResults";
import { Main } from "./Main";
import { Box } from "./Box";
import { ListedMovies } from "./ListedMovies";
import { MovieSummary } from "./MovieSummary";
import { MovieSelection } from "./MovieSelection";
import { SelectedMovieList } from "./SelectedMovieList";
export const apiKey = "7b9d26f7";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("Watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });
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
    localStorage.setItem("Watched", JSON.stringify(watched));
  }, [watched]);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const result = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          { signal: controller.signal }
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
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    deleteSelection();
    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [query]);
  return (
    <>
      <NavBar>
        <SearchInput query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
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
