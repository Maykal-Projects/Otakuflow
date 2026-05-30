"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [done, setDone] =
    useState(false);

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

  alert(
    "Password updated successfully!"
  );

  setDone(true);

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-10">

        <h1 className="text-4xl font-black mb-6">
          New Password
        </h1>

        {done ? (

          <div className="text-green-400">
            Password updated successfully.
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

    </main>
  );
}