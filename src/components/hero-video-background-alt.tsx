"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideoBackgroundAlt() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <div
        className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Use a static image instead of video */}
        <div
          className="absolute w-full h-full bg-cover bg-center opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80')",
          }}
        ></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 dark:from-background/90 dark:via-background/80 dark:to-background/95"></div>
    </div>
  );
}
