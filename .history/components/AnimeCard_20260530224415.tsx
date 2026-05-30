"use client";

import Link from "next/link";

export default function AnimeCard({
  anime,
}: {
  anime: any;
}) {
  return (
    <Link
  href={`/anime/${anime.mal_id}`}
  scroll={false}
      className="group relative block"
    >
      {/* Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/0 via-fuchsia-500/0 to-pink-500/0 group-hover:from-violet-600/30 group-hover:via-fuchsia-500/20 group-hover:to-pink-500/30 blur-2xl transition duration-700 rounded-[32px]" />

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-white/10 bg-zinc-950/80 backdrop-blur-xl transition duration-500 group-hover:border-violet-500/50 group-hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={
              anime.images?.jpg
                ?.large_image_url
            }
            alt=""
            className="w-full h-[150px] sm:h-[380px] object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

          {/* Floating Score */}
          {anime.score && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 backdrop-blur-xl bg-black/50 border border-white/10 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl">
              <p className="text-sm font-bold text-white">
                ⭐ {anime.score}
              </p>
            </div>
          )}

          {/* Episodes */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 backdrop-blur-xl bg-black/50 border border-white/10 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl">
  <p className="text-sm font-bold text-white">
    {anime.episodes
      ? `${anime.episodes} EP`
      : anime.airing
        ? "Airing"
        : "?? EP"}
  </p>
</div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 flex flex-col flex-1">
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres
              ?.slice(0, 2)
              .map(
                (
                  genre: any
                ) => (
                  <span
                    key={
                      genre.mal_id
                    }
                    className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300"
                  >
                    {genre.name}
                  </span>
                )
              )}
          </div>

          {/* Title */}
          <h2 className="text-sm sm:text-xl font-black leading-tight line-clamp-3 min-h-[88px] mb-3 group-hover:text-violet-300 transition">
            {anime.title}
          </h2>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm mt-auto">
            <p
  className={`${
    !anime.year &&
    !anime.aired?.from
      ? "text-violet-400"
      : "text-zinc-400"
  }`}
>
              {anime.year
  || anime.aired?.from?.split("-")[0]
  || "TBA"}
            </p>

            <p className="text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition">
              View →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}