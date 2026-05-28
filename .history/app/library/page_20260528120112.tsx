"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/Navbar";

import LibraryAnimeCard from "@/components/LibraryAnimeCard";

export default function LibraryPage() {
  const [animeList, setAnimeList] =
    useState<any[]>([]);

const [loggedIn, setLoggedIn] =
  useState(true);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadLibrary() {
      const {
  data: { session },
} =
  await supabase.auth.getSession();

const user =
  session?.user;

      if (!user) {
        setLoading(false);

        return;
      }

      const { data, error } =
        await supabase
          .from("library")
          .select(`
  *,
  progress,
  rating,
  favorite
`)
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (!error && data) {
        setAnimeList(data);
      }

      setLoading(false);
    }

    loadLibrary();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* TITLE */}
        <div className="mb-12">
          <h1 className="text-5xl font-black">
            My Library
          </h1>

          <p className="text-zinc-500 mt-3">
            Track your anime
            progress
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-fuchsia-500 animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          animeList.length ===
            0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <h2 className="text-5xl font-black mb-4">
                Your Library Is
                Empty
              </h2>

              <p className="text-zinc-500 text-lg">
                Add anime to your
                library to see
                them here.
              </p>
            </div>
          )}

        {/* GRID */}
        {!loading &&
          animeList.length >
            0 && (
            <div className="flex flex-wrap gap-10 justify-center">

  {animeList.map(
    (anime) => (

      <div
        key={anime.id}
        className="w-full max-w-[320px]"
      >

        <LibraryAnimeCard
          anime={anime}
          onRemove={(
            animeId
          ) =>
            setAnimeList(
              (
                prev
              ) =>
                prev.filter(
                  (
                    item
                  ) =>
                    item.id !==
                    animeId
                )
            )
          }
        />

      </div>
    )
  )}
</div>
          )}
      </div>
    </main>
  );
}