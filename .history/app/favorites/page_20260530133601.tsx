"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import LibraryAnimeCard from "@/components/LibraryAnimeCard";

import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {

  const [anime, setAnime] =
    useState<any[]>([]);

const [loggedIn, setLoggedIn] =
  useState(true);

  useEffect(() => {

    loadFavorites();

    const handleFocus = () => {
      loadFavorites();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, []);

  async function loadFavorites() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    const user =
      session?.user;

if (!user) {

  setLoggedIn(false);

  setAnime([]);

  return;

} else {

  setLoggedIn(true);

}

    const { data, error } =
      await supabase
        .from("library")
        .select("*")
        .eq("user_id", user.id)
        .eq("favorite", true)
        .order("created_at", {
          ascending: false,
        });

    if (error) {

      console.error(error);

      return;
    }

    setAnime(data || []);

    setLoggedIn(true);
  }

  return (
    <main className="min-h-screen bg-black text-white pt-28">

      <Navbar />

      {/* Hero */}
     <section className="relative pb-20 px-6">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-pink-700/20 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">

          <h1 className="text-6xl md:text-7xl font-black mb-6">
            Favorites
          </h1>

          <p className="text-zinc-400 text-xl">
            Your most loved anime
          </p>

        </div>

      </section>

      {/* Anime Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        {!loggedIn ? (

  <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-16 text-center">

    <h2 className="text-4xl font-black mb-4">
      Login Required
    </h2>

    <p className="text-zinc-400 mb-8">
      Login to save and view favorites.
    </p>

   <Link
  href="/login"
  className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold"
>
  Login
</Link>

  </div>

) : anime.length === 0 ? (

  <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-16 text-center text-zinc-400">
    No favorites yet.
  </div>

) : (

          <div className="flex flex-wrap gap-10 justify-center">

            {anime.map(
              (item: any) => (

                <LibraryAnimeCard
                  key={item.id}
                  anime={item}
                  hideRemoveButton
                  onRemove={(animeId) =>
                    setAnime(
                      prev =>
                        prev.filter(
                          item =>
                            item.anime_id !== animeId
                        )
                    )
                  }
                />

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}