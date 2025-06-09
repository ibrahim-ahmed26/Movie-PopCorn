import { useState } from "react";
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
import { useMovies } from "./CustomHooks/useMovies";
import { useLocalStorage } from "./CustomHooks/useLocalStorage";
export const apiKey = "7b9d26f7";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const { movies, error, isLoading } = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "Watched");
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
