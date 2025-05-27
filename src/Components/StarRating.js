import { useState } from "react";
import PropTypes from "prop-types"; // Don't forget to install prop-types if you haven't: npm install prop-types

export default function StarRating({
  maxRating = 5,
  color = "#f87171", // Changed default color to match --color-primary from your CSS
  size = 24, // Changed default size to match the previous example's usage
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

  // No specific style needed for starSpanStyle if the Star component handles its own sizing
  // and cursor. The Star component will handle the click.

  const ratingTextStyle = {
    fontSize: `${size / 1.5}px`,
    marginLeft: "8px",
    margin: "0",
    color: color, // Use the prop color
    fontWeight: "bold", // Added for emphasis on the rating text
  };

  function handleRating(newRating) {
    // Renamed parameter to newRating to avoid confusion
    setRating(newRating);
    // Only call onSetRating if it's provided as a prop
    if (onSetRating) {
      onSetRating(newRating);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={starsContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            // Determine if the star should be full based on hover or current rating
            full={hoverRating ? i < hoverRating : i < rating}
            color={color}
            size={size}
            onRate={() => handleRating(i + 1)} // Pass handler for individual star click
            onHoverIn={() => setHoverRating(i + 1)} // Pass hover in handler
            onHoverOut={() => setHoverRating(0)} // Pass hover out handler
          />
        ))}
      </div>
      <p style={ratingTextStyle}>
        {messages.length === maxRating // Check if messages array matches maxRating length
          ? messages[hoverRating ? hoverRating - 1 : rating - 1]
          : hoverRating || rating || ""}{" "}
        {/* Display hoverRating, then rating, then empty string */}
      </p>
    </div>
  );
}

// PropTypes for StarRating component
StarRating.propTypes = {
  maxRating: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number, // Added size to PropTypes
  messages: PropTypes.array,
  onSetRating: PropTypes.func,
  defaultRating: PropTypes.number,
};

// Star component: Now renders a complete SVG
function Star({ full, color, size, onRate, onHoverIn, onHoverOut }) {
  return (
    <span // Use a span to wrap the SVG for clickable area and hover events
      role="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      style={{
        display: "block", // Make span take full width/height for better click area
        cursor: "pointer",
        width: `${size}px`, // Apply size to the span wrapper
        height: `${size}px`, // Apply size to the span wrapper
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={full ? color : "none"} // Fill color if 'full' is true
        stroke={color} // Stroke color always present for outline when not filled
        // strokeWidth="2" // Default stroke width
        style={
          {
            // Apply star-specific styles here if needed,
            // but width/height are handled by the wrapper span
          }
        }
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </span>
  );
}

// PropTypes for Star component
Star.propTypes = {
  full: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  onRate: PropTypes.func.isRequired,
  onHoverIn: PropTypes.func.isRequired,
  onHoverOut: PropTypes.func.isRequired,
};
