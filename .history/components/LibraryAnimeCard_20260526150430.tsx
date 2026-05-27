"use client";

import { useState, useEffect } from "react";
import { Trash2, Heart, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Props {
  anime: any;
  onRemove?: (animeId: number) => void;
}

export default function LibraryAnimeCard({ anime, onRemove }: Props) {
  const [progress, setProgress] = useState(anime.progress || 0);
  const [rating, setRating] = useState(anime.rating || 0);
  const [favorite, setFavorite] = useState(anime.favorite || false);

  useEffect(() => {
    setProgress(anime.progress || 0);
    setRating(anime.rating || 0);
    setFavorite(anime.favorite || false);
  }, [anime]);

  async function removeAnime() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("library")
      .delete()
      .eq("id", anime.id);

    if (error) {
      console.error(error);
      toast.error("Failed to remove anime from library");
      return;
    }

    toast.success("Anime removed from library");
    onRemove && onRemove(anime.id);
  }

  async function updateProgress(newProgress: number) {
    const oldProgress = progress;
    setProgress(newProgress);

    const { error } = await supabase
      .from("library")
      .update({ progress: newProgress })
      .eq("id", anime.id);

    if (error) {
      console.error(error);
      setProgress(oldProgress);
      toast.error("Failed to save progress");
    }
  }

  async function updateRating(newRating: number) {
    const oldRating = rating;
    setRating(newRating);

    const { error } = await supabase
      .from("library")
      .update({ rating: newRating })
      .eq("id", anime.id);

    if (error) {
      console.error(error);
      setRating(oldRating);
      toast.error("Failed to save rating");
      return;
    }

    toast.success(`Rated ${newRating}/10 ⭐`);
  }

  async function toggleFavorite() {
    const newFav = !favorite;
    setFavorite(newFav);

    const { error } = await supabase
      .from("library")
      .update({ favorite: newFav })
      .eq("id", anime.id);

    if (error) {
      console.error(error);
      setFavorite(!newFav);
      toast.error("Failed to update favorite");
    } else {
      toast.success(
        newFav ? "Added to Favorites ❤️" : "Removed from Favorites 💔"
      );
    }
  }

  return (
    <div className="group relative w-[320px] min-w-[320px] max-w-[320px] h-[760px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/80 backdrop-blur-xl">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-[480px] object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-5 flex flex-col justify-between h-[280px]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black leading-tight line-clamp-2 h-[56px] overflow-hidden">{anime.title}</h2>
          <button onClick={toggleFavorite}>
            <Heart
              size={28}
              className={`transition ${
                favorite ? "text-pink-500 fill-pink-500" : "text-zinc-500"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400 min-h-[24px]">
          <span>{anime.episodes || "?"} eps</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span>{anime.status}</span>
        </div>

        {/* Progress */}
        <div>
          <label className="text-sm text-zinc-400">
            Progress {progress}/{anime.episodes || "?"}
          </label>
          <input
            type="range"
            min={0}
            max={anime.episodes || 1}
            value={progress}
            onChange={(e) => updateProgress(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              size={22}
              className={`cursor-pointer ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"
              }`}
              onClick={() => updateRating(i + 1)}
            />
          ))}
        </div>

        <button
          onClick={removeAnime}
          className="mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition font-semibold"
        >
          <Trash2 size={18} /> Remove from Library
        </button>
      </div>
    </div>
  );
}