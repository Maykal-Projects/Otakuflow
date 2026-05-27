"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Trash2,
  Star,
  Heart,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import toast from "react-hot-toast";

interface Props {
  anime: any;

  onRemove?: (
    animeId: number
  ) => void;
}

export default function LibraryAnimeCard({
  anime,
  onRemove,
}: Props) {

  const isFavoritesPage =
    window.location.pathname ===
    "/favorites";

  const [progress, setProgress] =
    useState(0);

  const [rating, setRating] =
    useState(0);

  const [favorite, setFavorite] =
    useState(false);

  useEffect(() => {

    setProgress(
      anime.progress || 0
    );

    setRating(
      anime.rating || 0
    );

    setFavorite(
      anime.favorite || false
    );

  }, [anime]);

  async function removeAnime() {

    if (isFavoritesPage) {

      const { error } =
        await supabase
          .from("favorites")
          .delete()
          .eq(
            "anime_id",
            anime.anime_id
          )
          .eq(
            "user_id",
            anime.user_id
          );

      if (error) {

        console.error(error);

        toast.error(
          "Failed to remove favorite"
        );

        return;
      }

      toast.success(
        "Removed from Favorites 💔"
      );

    } else {

      const { error } =
        await supabase
          .from("library")
          .delete()
          .eq(
            "id",
            anime.id
          );

      if (error) {

        console.error(error);

        toast.error(
          "Failed to remove anime"
        );

        return;
      }

      toast.success(
        "Removed from Library 🗑️"
      );
    }

    onRemove?.(
      anime.id
    );
  }

  async function updateProgress(
    value: number
  ) {

    const oldValue =
      progress;

    setProgress(value);

    const { error } =
      await supabase
        .from("library")
        .update({
          progress: value,
        })
        .eq(
          "id",
          anime.id
        );

    if (error) {

      console.error(error);

      setProgress(
        oldValue
      );

      toast.error(
        "Failed to save progress"
      );
    }
  }

  async function updateRating(
    value: number
  ) {

    const oldValue =
      rating;

    setRating(value);

    const { error } =
      await supabase
        .from("library")
        .update({
          rating: value,
        })
        .eq(
          "id",
          anime.id
        );

    if (error) {

      console.error(error);

      setRating(
        oldValue
      );

      toast.error(
        "Failed to save rating"
      );

      return;
    }

    toast.success(
      `Rated ${value}/10 ⭐`
    );
  }

  async function toggleFavorite() {

    const newValue =
      !favorite;

    setFavorite(
      newValue
    );

    const { error } =
      await supabase
        .from("library")
        .update({
          favorite:
            newValue,
        })
        .eq(
          "id",
          anime.id
        );

    if (error) {

      console.error(error);

      setFavorite(
        !newValue
      );

      toast.error(
        "Failed to update favorite"
      );

      return;
    }

    if (newValue) {

      const {
        data: existing,
      } =
        await supabase
          .from(
            "favorites"
          )
          .select("id")
          .eq(
            "anime_id",
            anime.anime_id
          )
          .eq(
            "user_id",
            anime.user_id
          )
          .maybeSingle();

      if (!existing) {

        await supabase
          .from(
            "favorites"
          )
          .insert({
            user_id:
              anime.user_id,

            anime_id:
              anime.anime_id,

            title:
              anime.title,

            image:
              anime.image,

            genres:
              anime.genres,

            score:
              anime.score,

            status:
              anime.status,

            favorite:
              true,
          });
      }

      toast.success(
        "Added to Favorites ❤️"
      );

    } else {

      await supabase
        .from(
          "favorites"
        )
        .delete()
        .eq(
          "anime_id",
          anime.anime_id
        )
        .eq(
          "user_id",
          anime.user_id
        );

      toast.success(
        "Removed from Favorites 💔"
      );
    }
  }

  return (
    <div className="group relative">

      {/* GLOW */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-30 transition duration-500" />

      {/* CARD */}
      <div className="relative min-h-[680px] rounded-[32px] overflow-hidden border border-white/10 bg-zinc-900/80 backdrop-blur-xl">

        {/* IMAGE */}
        <Link
          href={`/anime/${anime.anime_id}`}
        >
          <div className="relative h-[360px] overflow-hidden">

            <img
              src={
                anime.image
              }
              alt={
                anime.title
              }
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* FAVORITE BADGE */}
            {isFavoritesPage && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-2xl bg-pink-500/15 border border-pink-500/30 backdrop-blur-xl">

                <Heart
                  size={18}
                  className="fill-pink-500 text-pink-500"
                />

                <span className="text-sm font-black text-pink-300 tracking-wide">
                  Favorite
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* CONTENT */}
        <div className="p-5 flex flex-col justify-between h-[320px]">

          {/* TITLE */}
          <Link
            href={`/anime/${anime.anime_id}`}
          >
            <h2 className="h-[90px] text-[22px] font-black line-clamp-3 hover:text-violet-300 transition leading-[1.15]">
              {anime.title}
            </h2>
          </Link>

          {/* META */}
          <div className="mt-3 h-[110px] space-y-2">

            <div className="flex items-center gap-2 text-sm text-zinc-400">

              <span className="px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300 uppercase tracking-wide">
                {anime.type || "Anime"}
              </span>

              <span className="w-1 h-1 rounded-full bg-zinc-600" />

              <span>
                {anime.status ||
                  "Unknown"}
              </span>
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap gap-2">

              {(anime.genres || [])
                .slice(0, 2)
                .map(
                  (
                    genre: any,
                    index: number
                  ) => (

                    <span
                      key={index}
                      className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-zinc-300"
                    >
                      {typeof genre ===
                      "string"
                        ? genre
                        : genre.name}
                    </span>
                  )
                )}
            </div>
          </div>

          {/* LIBRARY FEATURES */}
          {!isFavoritesPage && (
            <>

              {/* PROGRESS */}
              <div className="mt-3 h-[70px]">

                <div className="flex items-center justify-between mb-2">

                  <p className="text-sm text-zinc-400 font-medium">
                    Progress
                  </p>

                  <p className="text-sm font-bold text-violet-300">
                    {progress}/
                    {anime.episodes || "?"}
                  </p>
                </div>

                <input
                  type="range"
                  min={0}
                  max={
                    anime.episodes || 24
                  }
                  value={progress}
                  onChange={(e) =>
                    updateProgress(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full accent-violet-500"
                />
              </div>

              {/* RATING */}
              <div className="flex items-center justify-between h-[42px] mt-2">

                <div className="flex items-center gap-1">

                  {[1,2,3,4,5,6,7,8,9,10].map(
                    (star) => (
                      <button
                        key={star}
                        onClick={() =>
                          updateRating(
                            star
                          )
                        }
                        className="transition hover:scale-110"
                      >

                        <Star
                          size={18}
                          className={
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-zinc-600"
                          }
                        />
                      </button>
                    )
                  )}
                </div>

                {/* FAVORITE TOGGLE */}
                <button
                  onClick={
                    toggleFavorite
                  }
                  className="transition hover:scale-110"
                >

                  <Heart
                    size={26}
                    className={
                      favorite
                        ? "text-pink-500 fill-pink-500"
                        : "text-zinc-500"
                    }
                  />
                </button>
              </div>
            </>
          )}

          {/* REMOVE */}
          <button
            onClick={
              removeAnime
            }
            className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition font-bold text-base"
          >

            <Trash2
              size={18}
            />

            {isFavoritesPage
              ? "Remove from Favorites"
              : "Remove from Library"}
          </button>
        </div>
      </div>
    </div>
  );
}