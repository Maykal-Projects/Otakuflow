"use client";

import { useState } from "react";

export default function TrailerPlayer({
  trailerUrl,
}: {
  trailerUrl: string;
}) {
  const [loaded, setLoaded] =
    useState(false);

  const videoId =
    trailerUrl
      .split("/embed/")[1]
      ?.split("?")[0];

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="w-full">
      <div className="relative rounded-[32px] overflow-hidden border border-zinc-800 bg-black shadow-[0_0_80px_rgba(139,92,246,0.15)] aspect-video">
        {/* Thumbnail Background */}
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Iframe */}
        <iframe
          className={`relative z-10 w-full h-full transition-opacity duration-500 ${
            loaded
              ? "opacity-100"
              : "opacity-0"
          }`}
          src={trailerUrl}
          title="Trailer"
          allowFullScreen
          onLoad={() =>
            setLoaded(true)
          }
        />
      </div>
    </div>
  );
}