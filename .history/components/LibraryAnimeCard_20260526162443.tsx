"use client";

import { useState, useEffect } from "react";
import { Trash2, Heart, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Props {
  anime: any;
  onRemove?: (animeId: number) => void;
  hideRemoveButton?: boolean;
}

export default function LibraryAnimeCard({
  anime,
  onRemove,
  hideRemoveButton = false,
}: Props) {
  const [progress, setProgress] = useState(anime.progress || 0);
  const [rating, setRating] = useState(anime.rating || 0);
  const [favorite, setFavorite] = useState(anime.favorite || false);

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

}, [
  anime.progress,
  anime.rating,
  anime.favorite,
]);

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

      await supabase
  .from("favorites")
  .update({
    progress: newProgress,
  })
  .eq(
    "anime_id",
    anime.anime_id ||
    anime.mal_id
  );
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

await supabase
  .from("favorites")
  .update({
    rating: newRating,
  })
  .eq(
    "anime_id",
    anime.anime_id ||
    anime.mal_id
  );

    toast.success(`Rated ${newRating}/10 ⭐`);
  }

  async function toggleFavorite() {

  const newFav =
    !favorite;

  setFavorite(newFav);

  // UPDATE LIBRARY
  const { error } =
    await supabase
      .from("library")
      .update({
        favorite: newFav,
      })
      .eq(
        "id",
        anime.id
      );

  if (error) {

    console.error(error);

    setFavorite(!newFav);

    toast.error(
      "Failed to update favorite"
    );

    return;
  }

  const animeId =
  anime.anime_id ||
  anime.mal_id;

  // REMOVE FROM FAVORITES
  if (!newFav) {

await supabase
  .from("library")
  .update({
    favorite: false,
  })
  .eq(
    "anime_id",
    animeId
  );

    await supabase
      .from("favorites")
      .delete()
      .eq(
        "anime_id",
        anime.anime_id
      );

    toast.success(
      "Removed from Favorites 💔"
    );

    onRemove &&
      onRemove(
        anime.anime_id
      );

} else {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const animeId =
    anime.anime_id ||
    anime.mal_id;

  await supabase
    .from("favorites")
    .upsert({
      anime_id:
        animeId,

      title:
        anime.title,

      image:
        anime.image,

      episodes:
        anime.episodes,

      status:
        anime.status,

      genres:
        anime.genres,

      progress:
        progress,

      rating:
        rating,

      favorite: true,

      user_id:
        user.id,
    });

  toast.success(
    "Added to Favorites ❤️"
  );
}
}

  return (
    <div
  className={`group relative w-[320px] min-w-[320px] max-w-[320px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/80 backdrop-blur-xl ${
    hideRemoveButton
      ? "h-[640px]"
      : "h-[760px]"
  }`}
>
      <div
  className={`relative w-full overflow-hidden flex-shrink-0 ${
    hideRemoveButton
      ? "h-[430px]"
      : "h-[480px]"
  }`}
>
        <img
          src={anime.image || "/default-anime.jpg"}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div
  className={
    hideRemoveButton
      ? ""
      : "mt-auto w-full h-[56px]"
  }
>
        <div className="flex items-center justify-between">
        <h2 className="text-xl font-black leading-tight line-clamp-2 min-h-[72px] max-h-[72px] overflow-hidden">
  {anime.title}
</h2>
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
        <div
  className={`flex items-center justify-center gap-1 ${
    hideRemoveButton
      ? "mb-0"
      : "mb-8"
  }`}
>
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

        {!hideRemoveButton && (
  <button
    onClick={removeAnime}
    className="w-full h-[56px] flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition font-semibold flex-shrink-0"
  >
    <Trash2 size={18} />
    Remove from Library
  </button>
)}
      </div>
    </div>
  );
}