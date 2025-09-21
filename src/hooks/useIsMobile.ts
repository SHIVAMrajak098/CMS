import { useState, useEffect } from 'react';

/**
 * A custom hook that returns true if the window width is less than a specified breakpoint.
 * @param breakpoint The width in pixels to consider the boundary for a mobile device. Defaults to 768px.
 * @returns {boolean} True if the current window width is less than the breakpoint, false otherwise.
 */
const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
