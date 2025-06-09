import { useEffect, useRef } from "react";
import { useKey } from "./CustomHooks/useKey";

export function SearchInput({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
