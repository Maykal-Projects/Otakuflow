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

      <div className="relative overflow-hidden w-full max-w-md rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-fuchsia-950/30 p-10 shadow-[0_0_80px_rgba(168,85,247,0.12)]">

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.12),transparent_40%)] pointer-events-none" />

<div className="relative z-10"></div>

        <h1 className="text-4xl font-black mb-4">
          Reset Password
        </h1>

       {!sent && (
  <p className="text-zinc-400 mb-8">
    Enter your email and we’ll send
    you a reset link.
  </p>
)}
        {sent ? (

  <div className="text-center">

    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-400/20 shadow-[0_0_40px_rgba(168,85,247,0.25)] flex items-center justify-center mx-auto mb-8 text-4xl backdrop-blur-xl">
      ✉️
    </div>

    <h2 className="text-3xl font-black mb-3">
      Check Your Email
    </h2>

    <p className="text-zinc-400 mb-3">
      We sent a password reset link to:
    </p>

    <p className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-semibold mb-8 break-all">
      {email}
    </p>

    <button
      onClick={handleReset}
      disabled={loading}
      className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] transition font-semibold"
    >
      {loading
        ? "Sending..."
        : "Resend Email"}
    </button>

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
      </div>

    </main>
  );
}