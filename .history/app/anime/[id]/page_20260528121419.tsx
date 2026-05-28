"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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

const [countdown, setCountdown] =
  useState("");

  const { id } =
    use(params);

  const [anime, setAnime] =
    useState<any>(null);

  const [user, setUser] =
    useState<any>(null);

    const [addingLibrary, setAddingLibrary] =
  useState(false);

const [addingFavorites, setAddingFavorites] =
  useState(false);

  useEffect(() => {
    fetchAnime();
    getUser();
  }, []);

  async function getUser() {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  setUser(user);
}

async function fetchCountdown(
  malId: number
) {

  const query = `
    query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
      }
    }
  `;

  const response =
    await fetch(
      "https://graphql.anilist.co",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          query,

          variables: {
            idMal: malId,
          },
        }),
      }
    );

  const json =
    await response.json();

  return json.data?.Media
    ?.nextAiringEpisode;
}

async function fetchAnime() {

  try {

    const response =
      await fetch(
        `https://api.jikan.moe/v4/anime/${id}/full`
      );

    const json =
      await response.json();

    const charactersResponse =
      await fetch(
        `https://api.jikan.moe/v4/anime/${id}/characters`
      );

    const charactersJson =
      await charactersResponse.json();

    setAnime({
      ...json.data,

      characters:
        charactersJson.data ||
        [],
    });

    const airing =
      await fetchCountdown(
        json.data.mal_id
      );

    if (airing) {

      const days =
        Math.floor(
          airing.timeUntilAiring /
          86400
        );

      const hours =
        Math.floor(
          (
            airing.timeUntilAiring %
            86400
          ) / 3600
        );

      const minutes =
        Math.floor(
          (
            airing.timeUntilAiring %
            3600
          ) / 60
        );

      setCountdown(
        `Episode ${airing.episode} airs in ${days}d ${hours}h ${minutes}m`
      );
    }

  } catch (error) {

    console.error(error);

  }
}

  async function addToLibrary() {

    if (addingLibrary) return;

setAddingLibrary(true);

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    toast.error(
      "Please login first"
    );

    router.push("/login");

      setAddingLibrary(false);
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
    "Already in library 📚",
    {
      id:
        "library-exists",
    }
  );

  setAddingLibrary(false);

  return;
}

    const { error } =
      await supabase
        .from("library")
        .insert({

          genres:
  anime.genres?.map(
    (g: any) =>
      g.name
  ),

          user_id:
            user.id,

          anime_id:
            anime.mal_id,

          title:
            anime.title,

          image:
            anime.images
              ?.jpg
              ?.large_image_url,

          score:
            anime.score,

          episodes:
            anime.episodes,

          status:
            anime.status,
        });

    if (error) {

  console.error(error);

  setAddingLibrary(false);

  return;
}

toast.success(
  "📚 Added to Library"
);

setAddingLibrary(false);
  }

async function addToFavorites() {

if (addingFavorites) return;

setAddingFavorites(true);

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    toast.error(
      "Please login first"
    );

    router.push("/login");

setAddingFavorites(false);

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

      favorite: true,
    })
    .maybeSingle();

if (existing) {

  toast(
    "Already in Favorites ❤️",
    {
      id:
        "favorite-exists",
    }
  );

  setAddingFavorites(false);

  return;
}

  const { error } =
  await supabase
    .from("library")
    .upsert(
      {
        anime_id:
          anime.mal_id,

        user_id:
          user.id,

        title:
          anime.title,

        image:
          anime.images
            ?.jpg
            ?.large_image_url,

        episodes:
          anime.episodes,

        status:
          anime.status,

        favorite: true,
      },
      {
        onConflict:
          "user_id,anime_id",
      }
    );

  if (error) {

  console.error(error);

  toast.error(
    "Failed to add to favorites"
  );

  setAddingFavorites(false);

  return;
}

 toast.success(
  "Added to Favorites ❤️"
);

setAddingFavorites(false);
}

  if (!anime) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[85vh] overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0">

          <img
  src={
    anime.images
      ?.jpg
      ?.large_image_url ||
    "/default-anime.jpg"
  }
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 via-black/50 to-black/90" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

          <div className="grid lg:grid-cols-[340px_1fr] gap-10 items-center">

            {/* POSTER */}
            <div className="relative group flex justify-center lg:justify-start">

              <div className="absolute -inset-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[36px] blur-3xl opacity-30 group-hover:opacity-50 transition duration-500" />

            <img
  src={
    anime.images
      ?.jpg
      ?.large_image_url ||
    anime.images
      ?.jpg
      ?.image_url ||
    "/default-anime.jpg"
  }
  alt={anime.title}
className="
  relative
  w-[320px]
  h-[480px]
  rounded-[28px]
  border
  border-white/10
  object-cover
  shadow-[0_20px_80px_rgba(0,0,0,0.8)]
  hover:scale-[1.02]
  transition
  duration-500
"
/>
            </div>

            {/* INFO */}
            <div>

              {/* TYPE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/20 backdrop-blur-xl mb-5">

                <Clapperboard
                  size={15}
                />

                <span className="text-xs font-semibold uppercase tracking-widest">
                  {anime.type}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight max-w-5xl">
                {anime.title}
              </h1>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                {/* EPISODES */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Episodes
                  </p>

                  <div className="flex items-center gap-2">

                    <Play
                      size={16}
                    />

                    <h2 className="text-3xl font-black">
                      {anime.episodes ||
                        "?"}
                    </h2>
                  </div>
                </div>

                {/* SCORE */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Score
                  </p>

                  <div className="flex items-center gap-2">

                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />

                    <h2 className="text-3xl font-black text-yellow-400">
                      {anime.score ||
                        "?"}
                    </h2>
                  </div>
                </div>

                {/* STATUS */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Status
                  </p>

                  <h2 className="text-lg font-bold leading-tight">
                    {anime.status}
                  </h2>

{countdown && (
  <p className="text-violet-300 text-sm mt-3 font-semibold">
    ⏳ {countdown}
  </p>
)}

                </div>

                {/* YEAR */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4">

                  <p className="text-zinc-400 text-sm mb-2">
                    Year
                  </p>

                  <div className="flex items-center gap-2">

                    <Calendar
                      size={16}
                    />

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

              {/* GENRES */}
              <div className="flex flex-wrap gap-3 mt-6">

                {anime.genres?.map(
                  (
                    genre: any
                  ) => (
                    <span
                      key={
                        genre.mal_id
                      }
                      className="px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl text-sm font-semibold hover:bg-violet-500/20 hover:border-violet-500/30 transition"
                    >
                      {genre.name}
                    </span>
                  )
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap items-center gap-4 mt-10">

                {/* LIBRARY */}
                <button
                  onClick={
                    addToLibrary
                  }
                  className="group w-[240px] h-[62px] rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-black text-base hover:scale-105 transition duration-300 shadow-[0_10px_60px_rgba(168,85,247,0.45)] flex items-center justify-center gap-3"
                >

                  <Plus
                    size={22}
                  />

                  {addingLibrary
  ? "Adding..."
  : "Add to Library"}
                </button>

                {/* FAVORITES */}
                <button
                  onClick={
                    addToFavorites
                  }
                  className="group w-[240px] h-[62px] rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 font-black text-base hover:scale-105 transition duration-300 shadow-[0_10px_60px_rgba(244,63,94,0.45)] flex items-center justify-center gap-3"
                >

                  <Heart
                    size={22}
                    className="fill-white"
                  />

                  {addingFavorites
  ? "Adding..."
  : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW + TRAILER */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-20">

          {/* OVERVIEW */}
          <div>

            <div className="flex items-center gap-4 mb-8">

              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />

              <h2 className="text-4xl font-black">
                Overview
              </h2>
            </div>

            <p className="text-zinc-300 text-lg leading-9 whitespace-pre-line">
              {anime.synopsis ||
                "No synopsis available."}
            </p>
          </div>

          {/* TRAILER */}
          <div>

            <div className="flex items-center gap-4 mb-8">

              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />

              <h2 className="text-4xl font-black">
                Trailer
              </h2>
            </div>

            {anime.trailer?.embed_url ? (
              <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

                <iframe
                  src={
                    anime.trailer.embed_url
                  }
                  title={
                    anime.title
                  }
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-16 text-center text-zinc-400">
                No trailer available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXTRA INFO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 space-y-24">

        {/* STUDIOS */}
        <div>

          <div className="flex items-center gap-4 mb-10">

            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />

            <h2 className="text-4xl font-black">
              Studios
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">

            {anime.studios?.map(
              (
                studio: any
              ) => (
                <div
                  key={
                    studio.mal_id
                  }
                  className="px-6 py-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-violet-500/30 transition"
                >

                  <p className="font-bold text-lg">
                    {studio.name}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* CHARACTERS */}
        <div>

          <div className="flex items-center gap-4 mb-10">

            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />

            <h2 className="text-4xl font-black">
              Characters
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

            {anime.characters
              ?.slice(0, 10)
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
                    className="rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:scale-[1.03] transition"
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

                      {item.voice_actors?.[0] && (
                        <div className="mt-4 flex items-center gap-3">

                          <img
                            src={
                              item
                                .voice_actors[0]
                                .person
                                .images
                                ?.jpg
                                ?.image_url
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />

                          <div>

                            <p className="text-xs text-zinc-500">
                              Voice Actor
                            </p>

                            <p className="text-sm font-semibold line-clamp-1">
                              {
                                item
                                  .voice_actors[0]
                                  .person
                                  .name
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </section>

    </main>
  );
}