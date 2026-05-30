"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {

  const [email, setEmail] =
    useState("");

  const [sent, setSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleReset() {

    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "http://localhost:3000/reset-password",
        }
      );

    if (!error) {
      setSent(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-10">

        <h1 className="text-4xl font-black mb-4">
          Reset Password
        </h1>

        <p className="text-zinc-400 mb-8">
          Enter your email and we’ll send
          you a reset link.
        </p>

        {sent ? (

          <div className="text-green-400">
            Reset email sent.
          </div>

        ) : (

          <>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 mb-6 outline-none"
            />

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </>

        )}

      </div>

    </main>
  );
}