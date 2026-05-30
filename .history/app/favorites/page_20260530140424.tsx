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
  
const [loading, setLoading] =
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
  setLoading(false);

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
      setLoading(false);

      return;
    }

    setAnime(data || []);

    setLoggedIn(true);

    setLoading(false);
  }

 return (
  <main className="min-h-screen bg-black text-white">
    <Navbar />

    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">

      {/* TITLE */}
      <div className="mb-12">
        <h1 className="text-5xl font-black">
          Favorites
        </h1>

        <p className="text-zinc-500 mt-3">
          Your most loved anime
        </p>
      </div>

    {/* CONTENT */}
{loading ? null : !loggedIn ? (

  <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-16 text-center">

    <h2 className="text-5xl font-black mb-4">
      Login Required
    </h2>

    <p className="text-zinc-400 text-lg mb-8">
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

        <div className="flex flex-col items-center justify-center py-32 text-center">

          <h2 className="text-5xl font-black mb-4">
            No Favorites Yet
          </h2>

          <p className="text-zinc-500 text-lg">
            Save anime to your favorites
            to see them here.
          </p>

        </div>

      ) : (

        <div className="flex flex-wrap gap-10 justify-center">

          {anime.map((item: any) => (

            <div
              key={item.id}
              className="w-full max-w-[320px]"
            >

              <LibraryAnimeCard
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

            </div>

          ))}

        </div>
 ) : null}
    </div>
  </main>
);
}