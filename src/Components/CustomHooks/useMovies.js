import { useState, useEffect } from "react";
import { apiKey } from "../App.js";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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

    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
