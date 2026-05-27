"use client";

import Image from "next/image";
import toast from "react-hot-toast";

import {
  use,
  useEffect,
  useState,
} from "react";

import {
  Play,
  Plus,
  Star,
  Calendar,
  Clapperboard,
  Heart,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import { supabase } from "@/lib/supabase";

interface AnimePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnimePage({
  params,
}: AnimePageProps) {

  const { id } =
    use(params);

  const [anime, setAnime] =
    useState<any>(null);

  useEffect(() => {

  fetchAnime();

}, []);

  async function fetchAnime() {
if (anime) return;
    try {

      const response =
  await fetch(
    `https://api.jikan.moe/v4/anime/${id}/full`
  );

if (!response.ok) {

  throw new Error(
    `Jikan error: ${response.status}`
  );
}

      const json =
        await response.json();

      const charactersResponse =
  await fetch(
    `https://api.jikan.moe/v4/anime/${id}/characters`
  );

if (
  !charactersResponse.ok
) {

  throw new Error(
    `Jikan error: ${charactersResponse.status}`
  );
}

      const charactersJson =
        await charactersResponse.json();

      setAnime({
        ...json.data,

        characters:
          Array.isArray(
            charactersJson.data
          )
            ? charactersJson.data
            : [],
      });

    } catch (error) {

     console.error(error);

toast.error(
  "Failed to load anime"
);

    }
  }

  async function addToLibrary() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    const user =
      session?.user;

    if (!user) {

      toast.error(
        "Login required"
      );

      return;
    }

    const { data: existing } =
      await supabase
        .from("library")
        .select("id")
        .match({

          user_id:
            user.id,

          anime_id:
            anime.mal_id,
        })
        .maybeSingle();

    if (existing) {

      toast(
        "Already in library!"
      );

      return;
    }

    const payload = {

  user_id:
    user.id,

  anime_id:
    anime.mal_id,

  title:
    anime.title,

  image:
    anime.images
      ?.jpg
      ?.large_image_url ||

    anime.images
      ?.jpg
      ?.image_url ||

    "",

  episodes:
    anime.episodes,

  status:
    anime.status,

  progress: 0,

  rating: 0,

  favorite: false,
};

    const {
      error,
    } =
      await supabase
        .from("library")
        .insert(payload);

    if (error) {

      alert(
        JSON.stringify(
          error,
          null,
          2
        )
      );

      return;
    }

    toast.success(
      "Added to Library ✨"
    );
  }

  async function addToFavorites() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    const user =
      session?.user;

    if (!user) {

      toast.error(
        "Login required"
      );

      return;
    }

    const { data: existing } =
      await supabase
        .from("favorites")
        .select("id")
        .match({

          user_id:
            user.id,

          anime_id:
            anime.mal_id,
        })
        .maybeSingle();

    if (existing) {

      toast(
        "Already in Favorites"
      );

      return;
    }

    const { error } =
      await supabase
        .from("favorites")
        .insert({

          user_id:
            user.id,

          anime_id:
            anime.mal_id,

          title:
            anime.title,

          image:
  anime.images
    ?.jpg
    ?.large_image_url ||
  anime.images
    ?.jpg
    ?.image_url ||
  "",
        });

    if (error) {

      alert(
        JSON.stringify(error)
      );

      return;
    }

    toast.success(
      "Added to Favorites ❤️"
    );
  }

  if (!anime) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[85vh] overflow-hidden">

        <div className="absolute inset-0">

          <img
            src={
              anime.images
                ?.jpg
                ?.large_image_url
            }
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 via-black/50 to-black/90" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-center">

            <div className="relative group flex justify-center lg:justify-start">

              <Image
                src={
                  anime.images
                    ?.jpg
                    ?.large_image_url
                }
                alt={anime.title}
                width={260}
                height={390}
                className="relative rounded-[28px] border border-white/10 object-cover"
              />
            </div>

            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/20 mb-5">

                <Clapperboard
                  size={15}
                />

                <span className="text-xs font-semibold uppercase tracking-widest">
                  {anime.type}
                </span>

              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight max-w-5xl">
                {anime.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Episodes
                  </p>

                  <div className="flex items-center gap-2">

                    <Play size={16} />

                    <h2 className="text-3xl font-black">
                      {anime.episodes || "?"}
                    </h2>

                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Score
                  </p>

                  <div className="flex items-center gap-2">

                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />

                    <h2 className="text-3xl font-black text-yellow-400">
                      {anime.score || "?"}
                    </h2>

                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Status
                  </p>

                  <h2 className="text-lg font-bold leading-tight">
                    {anime.status}
                  </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Year
                  </p>

                  <div className="flex items-center gap-2">

                    <Calendar size={16} />

                    <h2 className="text-3xl font-black">
                      {anime.year ||
                        anime.aired?.from?.split(
                          "-"
                        )[0] ||
                        "TBA"}
                    </h2>

                  </div>
                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                {anime.genres?.map(
                  (
                    genre: any
                  ) => (
                    <span
                      key={
                        genre.mal_id
                      }
                      className="px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/10 text-sm font-semibold"
                    >
                      {genre.name}
                    </span>
                  )
                )}

              </div>

              <div className="flex flex-wrap items-center gap-4 mt-10">

                <button
                  onClick={
                    addToLibrary
                  }
                  className="group w-[240px] h-[62px] rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-black text-base flex items-center justify-center gap-3"
                >

                  <Plus size={22} />

                  Add to Library

                </button>

                <button
                  onClick={
                    addToFavorites
                  }
                  className="group w-[240px] h-[62px] rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 font-black text-base flex items-center justify-center gap-3"
                >

                  <Heart
                    size={22}
                    className="fill-white"
                  />

                  Add to Favorites

                </button>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CHARACTERS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="flex items-center gap-4 mb-10">

          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />

          <h2 className="text-4xl font-black">
            Characters
          </h2>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {Array.isArray(
            anime.characters
          )
            ? anime.characters
                .slice(0, 10)
                .map(
                  (
                    item: any
                  ) => (

                    <div
                      key={
                        item
                          .character
                          .mal_id
                      }
                      className="rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.04]"
                    >

                      <div className="relative aspect-[3/4] overflow-hidden">

                        <img
                          src={
                            item
                              .character
                              .images
                              ?.jpg
                              ?.image_url
                          }
                          alt={
                            item
                              .character
                              .name
                          }
                          className="w-full h-full object-cover"
                        />

                      </div>

                      <div className="p-4">

                        <h3 className="font-black text-lg line-clamp-1">

                          {
                            item
                              .character
                              .name
                          }

                        </h3>

                        <p className="text-zinc-400 text-sm mt-1">
                          {item.role}
                        </p>

                      </div>

                    </div>

                  )
                )
            : null}

        </div>

      </section>

    </main>
  );
}