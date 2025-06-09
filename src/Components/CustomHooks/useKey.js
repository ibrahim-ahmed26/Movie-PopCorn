import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [action, key]);
}
