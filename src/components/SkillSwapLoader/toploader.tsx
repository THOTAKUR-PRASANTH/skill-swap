"use client";

import NextTopLoader from 'nextjs-toploader';
import './toploader.css'; // Import the optimized CSS

const TopLoader = () => {
  return (
    <NextTopLoader
      color="linear-gradient(to right, #f472b6, #c084fc, #22d3ee)"
      initialPosition={0.08}
      crawlSpeed={150}   // slightly slower for smoother motion
      height={4}         // same as CSS
      crawl={true}
      showSpinner={false} // keep spinner hidden
      easing="ease"
      speed={300}        // slightly slower to reduce GPU load
      shadow="0 0 10px #c084fc, 0 0 5px #c084fc" // lighter shadow for performance
    />
  );
};

export default TopLoader;
