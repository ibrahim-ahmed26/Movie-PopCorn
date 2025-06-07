import { MovieSummaryList } from "./MovieSummaryList";
import { MovieSummaryHeader } from "./MovieSummaryHeader";

export function MovieSummary({ watched }) {
  return (
    <div className="summary">
      <MovieSummaryHeader />
      <MovieSummaryList watched={watched} />
    </div>
  );
}
