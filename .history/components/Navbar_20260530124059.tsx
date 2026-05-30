"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname =
    usePathname();

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);
    }

    getUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  function navClass(
    path: string
  ) {
    const active =
      pathname === path;

    return `px-5 py-3 rounded-2xl transition font-semibold ${
      active
        ? "bg-violet-500/10 border border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.35)]"
        : "bg-white/[0.03] border border-white/10 backdrop-blur-2xl"
    }`;
  }

  return (
  <div className="absolute top-0 left-0 w-full z-50 flex justify-center pt-4 px-4">
    <nav className="w-full rounded-[32px] border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-black/30 to-fuchsia-950/30 backdrop-blur-3xl shadow-[0_10px_80px_rgba(139,92,246,0.25)] relative">

      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.18),transparent_35%)]" />

      {/* CONTENT */}
      <div className="relative px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">

          <Link
            href="/"
            className={navClass(
              "/"
            )}
          >
            Home
          </Link>

          <Link
            href="/library"
            className={navClass(
              "/library"
            )}
          >
            Library
          </Link>

          <Link
            href="/favorites"
            className={navClass(
              "/favorites"
            )}
          >
            Favorites
          </Link>
        </div>

        {/* RIGHT */}
<div className="flex flex-wrap justify-center items-center gap-2 w-full lg:w-auto">

  {user && (
    <Link
      href="/profile"
      className={`${navClass(
        "/profile"
      )} flex items-center gap-2 min-w-0`}
    >
      <img
        src={
          user
            .user_metadata
            ?.avatar_url ||
          "/default-avatar.png"
        }
        alt=""
        className="w-10 h-10 rounded-full object-cover border border-violet-500/20"
      />

      <span>
        Profile
      </span>
    </Link>
  )}

  {user && (
    <button
      onClick={logout}
      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 sm:px-6 py-3 rounded-2xl font-semibold transition"
    >
      Logout
    </button>
  )}

  {!user && (
    <Link
      href="/login"
      className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-4 sm:px-6 py-3 rounded-2xl font-semibold transition"
    >
      Login
    </Link>
  )}

</div>
      </div>
    </nav>
  </div>
);
}