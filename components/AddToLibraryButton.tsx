"use client";

import { supabase } from "@/lib/supabase";

import toast from "react-hot-toast";

export default function AddToLibraryButton({
  anime,
}: any) {
  async function addToLibrary() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";

      return;
    }

    const { data: existing } =
      await supabase
        .from("user_anime")
        .select("*")
        .eq("user_id", user.id)
        .eq("anime_id", anime.id)
        .maybeSingle();

    if (existing) {
      toast.error(
        "Anime already added"
      );

      return;
    }

    const { error } = await supabase
      .from("user_anime")
      .insert({
        user_id: user.id,

        anime_id: anime.id,

        title:
          anime.title.english ||
          anime.title.romaji,

        image:
          anime.coverImage.extraLarge,

        episodes:
          anime.episodes || 0,

        status: "Watching",

        progress: 0,

        score: 0,
      });

    if (error) {
      console.error(error);

      toast.error(
        "Failed to add anime"
      );

      return;
    }

    toast.success("Anime added!");
  }

  return (
    <button
      onClick={addToLibrary}
      className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:scale-105 transition duration-300 px-8 py-4 rounded-2xl font-bold shadow-[0_0_40px_rgba(168,85,247,0.35)]"
    >
      Add to Library
    </button>
  );
}