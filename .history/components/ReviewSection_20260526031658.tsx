"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import toast from "react-hot-toast";

export default function ReviewSection({
  animeId,
}: {
  animeId: number;
}) {
  const [reviews, setReviews] =
    useState<any[]>([]);

  const [review, setReview] =
    useState("");

  const [rating, setRating] =
    useState(10);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const { data, error } =
      await supabase
        .from("anime_reviews")
        .select("*")
        .eq(
          "anime_id",
          animeId.toString()
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);

      return;
    }

    setReviews(data || []);
  }

  async function submitReview() {
    if (!review.trim()) return;

    setLoading(true);

    const {
  data: { session },
} =
  await supabase.auth.getSession();

const user =
  session?.user;

    if (!user) {
      toast.error(
        "Please login first"
      );

      setLoading(false);

      return;
    }

    const { error } = await supabase
      .from("anime_reviews")
      .insert({
        anime_id:
          animeId.toString(),

        user_id: user.id,

        username:
          user.user_metadata
            ?.username ||
          user.email,

        avatar:
          user.user_metadata
            ?.avatar_url || "",

        review,

        rating,
      });

    if (error) {
      console.error(error);

      toast.error(
        "Failed to post review"
      );

      setLoading(false);

      return;
    }

    toast.success(
      "Review posted!"
    );

    setReview("");

    setRating(10);

    loadReviews();

    setLoading(false);
  }

  async function deleteReview(
    id: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("anime_reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);

      toast.error(
        "Failed to delete review"
      );

      return;
    }

    toast.success(
      "Review deleted"
    );

    loadReviews();
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-10">
        <h2 className="text-5xl font-black mb-3">
          Community Reviews
        </h2>

        <p className="text-zinc-400 text-lg">
          Reviews from your users
        </p>
      </div>

      {/* Form */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 mb-12">
        <textarea
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          placeholder="Write your review..."
          className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 outline-none focus:border-violet-500 resize-none"
        />

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <div>
            <p className="text-zinc-400 mb-2">
              Rating
            </p>

            <input
              type="number"
              min={1}
              max={100}
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(
                    e.target.value
                  )
                )
              }
              className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 w-32 outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={submitReview}
            disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 px-8 py-4 rounded-2xl font-bold transition"
          >
            {loading
              ? "Posting..."
              : "Post Review"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-8">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.avatar ||
                    "https://placehold.co/100x100"
                  }
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-bold text-xl">
                    {item.username}
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Anime Fan
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black text-violet-400">
                  {item.rating}
                </p>

                <p className="text-zinc-400 text-sm">
                  Rating
                </p>
              </div>
            </div>

            <p className="text-zinc-300 leading-8">
              {item.review}
            </p>

            <button
              onClick={() =>
                deleteReview(
                  item.id
                )
              }
              className="mt-6 text-red-400 hover:text-red-300 transition"
            >
              Delete
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-400">
            No reviews yet.
          </div>
        )}
      </div>
    </section>
  );
}