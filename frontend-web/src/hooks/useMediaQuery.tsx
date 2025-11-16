"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    const media = window.matchMedia(query);
    
    // Set the initial state
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Add a listener for changes
    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    // Cleanup on unmount
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}