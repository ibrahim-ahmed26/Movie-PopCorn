export function ToggleButton({ isOpen, onToggle }) {
  return (
    <button className="btn-toggle" onClick={onToggle}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
