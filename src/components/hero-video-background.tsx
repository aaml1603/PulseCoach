"use client";

import { useEffect, useState } from "react";

export default function HeroVideoBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading to avoid flash of content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <div
        className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute w-full h-full">
          <iframe
            src="https://streamable.com/e/gz6mc2"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Fitness background video"
            className="absolute w-full h-full object-cover opacity-20 dark:opacity-10"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: "0px",
              top: "0px",
              overflow: "hidden",
            }}
          ></iframe>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 dark:from-background/90 dark:via-background/80 dark:to-background/95"></div>
    </div>
  );
}
