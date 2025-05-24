import { useState } from "react";
import PropTypes from "prop-types";
StarRating.propTypes = {
  maxRating: PropTypes.number.isRequired,
  color: PropTypes.string,
  messages: PropTypes.array,
  onSetRating: PropTypes.func,
  defaultRating: PropTypes.number,
};
export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  messages = [],
  onSetRating,
  defaultRating = 0,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const starsContainerStyle = {
    display: "flex",
  };

  const starSpanStyle = {
    cursor: "pointer",
    padding: "4px",
  };

  const ratingTextStyle = {
    fontSize: `${size / 1.5}px`,
    marginLeft: "8px",
    margin: "0",
    color: color,
  };
  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }
  return (
    <div style={containerStyle}>
      <div style={starsContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span
            key={i}
            style={starSpanStyle}
            onClick={() => handleRating(i + 1)}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              filled={hoverRating ? i < hoverRating : i < rating}
              color={color}
              size={size}
            />
          </span>
        ))}
      </div>
      <p style={ratingTextStyle}>
        {messages.length === maxRating
          ? messages[hoverRating ? hoverRating - 1 : rating - 1]
          : hoverRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ filled, color, size }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? color : "none"}
      viewBox="0 0 24 24"
      stroke={color}
      style={starStyle}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}
