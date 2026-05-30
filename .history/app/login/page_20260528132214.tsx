"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  async function login() {
    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 mb-6"
        />

        <button
          onClick={login}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
        >
          Login
        </button>

        <p className="mt-6 text-zinc-400">
          No account?{" "}
          <Link
            href="/signup"
            className="text-purple-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}