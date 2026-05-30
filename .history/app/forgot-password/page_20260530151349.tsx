"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {

  const [email, setEmail] =
    useState("");

  const [sent, setSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

const [resent, setResent] =
  useState(false);

const [cooldown, setCooldown] =
  useState(0);
  
useEffect(() => {

  if (cooldown <= 0) return;

  const timer = setInterval(() => {

    setCooldown((prev) => prev - 1);

  }, 1000);

  return () => clearInterval(timer);

}, [cooldown]);

 async function handleReset(): Promise<void> {

  if (loading || cooldown > 0) return;

  setLoading(true);

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "http://localhost:3000/reset-password",
      }
    );

if (error) {

  console.error(error);

  const match =
    error.message.match(/\d+/);

  if (match) {

    setCooldown(
      Number(match[0])
    );

  }

  setLoading(false);

  return;
}
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="relative overflow-hidden w-full max-w-md rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-fuchsia-950/30 p-10 shadow-[0_0_80px_rgba(168,85,247,0.12)]">

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.12),transparent_40%)] pointer-events-none" />

<div className="relative z-10">

        <h1 className="text-4xl font-black mb-4 text-center">
          Reset Password
        </h1>

       {!sent && (
  <p className="text-zinc-300/80 mb-8">
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
    type="button"
      onClick={handleReset}
      disabled={loading || cooldown > 0}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-violet-600/20 hover:to-fuchsia-600/20 border border-white/10 active:scale-[0.98] transition font-semibold"
    >
     {cooldown > 0
  ? `Wait ${cooldown}s`
  : loading
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
            type="button"
              onClick={handleReset}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

{resent && (

  <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400 shadow-[0_0_25px_rgba(34,197,94,0.18)] backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-300">

    {cooldown > 0
      ? `Another reset email was already sent. Try again in ${cooldown}s.`
      : "Reset email sent successfully."}

  </div>

)}
          </>

        )}
      </div>
      </div>

    </main>
  );
}