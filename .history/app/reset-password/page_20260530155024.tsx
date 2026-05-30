"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

    const [done, setDone] =
  useState(false);

useEffect(() => {

  const {
    data: listener,
  } =
    supabase.auth.onAuthStateChange(
      async (event) => {

        if (
          event ===
          "PASSWORD_RECOVERY"
        ) {

          console.log(
            "Recovery session active"
          );

        }

      }
    );

  return () => {
    listener.subscription.unsubscribe();
  };

}, []);
    
async function updatePassword() {

  if (!password) return;

  setLoading(true);

  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  console.log(data);
  console.log(error);

  if (error) {

    alert(error.message);

    setLoading(false);

    return;
  }

  await supabase.auth.signOut();

setDone(true);

setLoading(false);
}

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

    
      <div className="relative overflow-hidden w-full max-w-md rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-fuchsia-950/30 p-10 shadow-[0_0_80px_rgba(168,85,247,0.12)]">

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.12),transparent_40%)] pointer-events-none" />

<div className="relative z-10">


        <h1 className="text-4xl font-black mb-6 text-center">
          New Password
        </h1>

        {done ? (

        <div className="text-center">

  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">
    ✓
  </div>

  <h2 className="text-3xl font-black mb-3">
    Password Updated
  </h2>

  <p className="text-zinc-400 mb-8">
    Your password was changed successfully.
  </p>

  <button
    onClick={() =>
      window.location.href = "/login"
    }
    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold"
  >
    Back To Login
  </button>

</div>

        ) : (

          <>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 mb-6 outline-none"
            />

            <button
              onClick={updatePassword}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold"
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </>

        )}

      </div>
    </div>

  </main>
);
}