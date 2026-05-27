"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/Navbar";

import AvatarUploader from "@/components/AvatarUploader";

export default function ProfilePage() {
  const [user, setUser] =
    useState<any>(null);

  const [anime, setAnime] =
    useState<any[]>([]);

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

const [stats, setStats] =
  useState({
    total: 0,
    completed: 0,
    watching: 0,
    average: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href =
        "/login";

      return;
    }

    setUser({
      ...user,
    });

    const { data: animeData } =
      await supabase
        .from("user_anime")
        .select("*")
        .eq("user_id", user.id);

    const {
      data: reviewData,
    } = await supabase
      .from("anime_reviews")
      .select("*")
      .eq("user_id", user.id);

    setAnime(animeData || []);

    setReviews(reviewData || []);

    const { data: library } =
  await supabase
    .from("library")
    .select("*")
    .eq("user_id", user.id);

if (library) {

  const total =
    library.length;

  const rated =
    library.filter(
      (anime) =>
        anime.rating > 0
    );

  const average =
    rated.length > 0
      ? (
          rated.reduce(
            (
              acc,
              anime
            ) =>
              acc +
              anime.rating,
            0
          ) / rated.length
        ).toFixed(1)
      : 0;

  setStats({
    total,
    completed,
    watching,
    average:
      Number(average),
  });
}

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading profile...
        </h1>
      </main>
    );
  }

  const completed =
    anime.filter(
      (a) =>
        a.status ===
        "Completed"
    ).length;

  const watching =
    anime.filter(
      (a) =>
        a.status ===
        "Watching"
    ).length;

  return (
    <main className="min-h-screen bg-black text-white pt-28">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-700/20 blur-[180px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-6">
              <img
                src={
                  user?.user_metadata
                    ?.avatar_url ||
                  "https://placehold.co/200x200"
                }
                alt="Avatar"
                className="w-40 h-40 rounded-full border-4 border-violet-500 object-cover"
              />

              <AvatarUploader
                user={user}
                onUpload={(url) =>
                  setUser({
                    ...user,
                    user_metadata:
                      {
                        ...user.user_metadata,
                        avatar_url:
                          url,
                      },
                  })
                }
              />
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-6xl font-black mb-4">
                {user
                  ?.user_metadata
                  ?.username ||
                  user?.email}
              </h1>

              <p className="text-zinc-400 text-xl">
                Anime Enthusiast
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              Anime Entries
            </p>

            <h2 className="text-5xl font-black">
  {stats.total}
</h2>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              Completed
            </p>

            <h2 className="text-5xl font-black">
  {stats.completed}
</h2>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              Watching
            </p>

           <h2 className="text-5xl font-black">
  {stats.watching}
</h2>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              Average Score
            </p>

          <h2 className="text-5xl font-black">
  {stats.average}
</h2>
          </div>

        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="mb-10">
          <h2 className="text-5xl font-black mb-3">
            My Reviews
          </h2>

          <p className="text-zinc-400 text-lg">
            Reviews written by you
          </p>
        </div>

        <div className="space-y-8">

          {reviews.map(
            (review) => (
              <div
                key={review.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8"
              >
                <div className="flex items-center justify-between mb-6">

                  <h3 className="text-2xl font-bold">
                    Anime Review
                  </h3>

                  <p className="text-3xl font-black text-violet-400">
                    {
                      review.rating
                    }
                  </p>
                </div>

                <p className="text-zinc-300 leading-8">
                  {
                    review.review
                  }
                </p>
              </div>
            )
          )}

          {reviews.length ===
            0 && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-400">
              No reviews yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}