"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  async function signup() {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created!");

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6">
          Sign Up
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
          onClick={signup}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
        >
          Create Account
        </button>

        <p className="mt-6 text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}