"use client";

import Image from "next/image";

import { Heart } from "lucide-react";

interface LibraryAnimeCardProps {

  anime: any;

  onRemove?: (
    animeId: any
  ) => void;
}

export default function LibraryAnimeCard({

  anime,

  onRemove,

}: LibraryAnimeCardProps) {

  return (
    <div className="rounded-[28px] overflow-hidden border border-white/10 bg-zinc-900">

      <div className="relative aspect-[2/3]">

        <Image
          src={anime.image}
          alt={anime.title}
          fill
          className="object-cover"
        />

        {anime.favorite && (

          <div className="absolute top-4 right-4">

            <Heart
              className="text-pink-500 fill-pink-500"
              size={28}
            />
          </div>
        )}
      </div>

      <div className="p-5">

        <h2 className="font-black text-2xl leading-tight">
          {anime.title}
        </h2>

        <p className="text-zinc-400 mt-2">
          {anime.episodes || "?"} eps
        </p>

        <div className="mt-4">

          <p className="text-sm text-zinc-400 mb-2">
            Progress {anime.progress || 0}/
            {anime.episodes || "?"}
          </p>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

            <div
              className="h-full bg-violet-500"
              style={{
                width: `${
                  anime.episodes
                    ? (
                        ((anime.progress || 0) /
                          anime.episodes) *
                        100
                      )
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() =>
            onRemove?.(anime.id)
          }
          className="mt-6 w-full rounded-2xl bg-red-500/10 border border-red-500/20 py-4 font-bold hover:bg-red-500/20 transition"
        >

          Remove
        </button>
      </div>
    </div>
  );
}