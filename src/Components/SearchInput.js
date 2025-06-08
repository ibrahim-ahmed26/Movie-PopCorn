import { useEffect, useRef } from "react";

export function SearchInput({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(() => {
    function callBack(e) {
      if (document.activeElement === inputEl.current) return;
      if (e.key === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keypress", callBack);
    inputEl.current.focus();
    return () => document.removeEventListener("keypress", callBack);
  }, [setQuery]);
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
