import { useEffect } from "react";

// Hook
export const useWindowResize = (handler: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [handler]);
};
