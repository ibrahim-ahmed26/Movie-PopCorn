import { useState } from "react";
import { ToggleButton } from "./ToggleButton";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} onToggle={() => setIsOpen((o) => !o)} />
      {isOpen && children}
    </div>
  );
}
