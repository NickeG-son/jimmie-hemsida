import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 1024) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Determine initially
    const checkIsMobile = () => setIsMobile(window.innerWidth < breakpoint);
    
    checkIsMobile(); // run once on mount
    
    // Add event listener for screen resizing
    window.addEventListener("resize", checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
