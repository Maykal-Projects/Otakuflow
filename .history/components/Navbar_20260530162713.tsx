"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";

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

  const [mobileMenu, setMobileMenu] =
    useState(false);

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

    return `px-4 py-3 rounded-2xl transition font-semibold text-sm ${
      active
        ? "bg-violet-500/10 border border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.35)]"
        : "bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.06]"
    }`;
  }

  return (

    <header className="fixed top-0 left-0 w-full z-[999999] px-4 pt-4">

      <nav className="mx-auto w-full max-w-[1700px] rounded-3xl border border-violet-500/20 bg-red-500">

        {/* GLOW */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.18),transparent_35%)]" />

        <div className="relative z-10 px-3 sm:px-6 py-3 sm:py-4">

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center justify-between gap-3">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <Link
                href="/"
                className={navClass("/")}
              >
                Home
              </Link>

              <Link
                href="/library"
                className={navClass("/library")}
              >
                Library
              </Link>

              <Link
                href="/favorites"
                className={navClass("/favorites")}
              >
                Favorites
              </Link>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {user && (

                <Link
                  href="/profile"
                  className={`${navClass(
                    "/profile"
                  )} flex items-center gap-2`}
                >

                  <img
                    src={
                      user.user_metadata
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

              {user ? (

                <button
                  onClick={logout}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-3 rounded-2xl font-semibold transition"
                >
                  Logout
                </button>

              ) : (

                <Link
                  href="/login"
                  className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-6 py-3 rounded-2xl font-semibold transition"
                >
                  Login
                </Link>

              )}

            </div>
          </div>

          {/* MOBILE */}
          <div className="sm:hidden">

            {/* TOP BAR */}
            <div className="flex items-center justify-between">

              <h1 className="text-lg font-black bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Anime
              </h1>

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(
                    !mobileMenu
                  )
                }
                className="p-2 rounded-xl border border-white/10 bg-white/[0.03] active:scale-95 transition"
              >

                {mobileMenu ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}

              </button>

            </div>

            {/* DROPDOWN */}
            <div
  className={`grid transition-all duration-300 ${
    mobileMenu
      ? "grid-rows-[1fr] opacity-100 mt-4"
      : "grid-rows-[0fr] opacity-0"
  }`}
>

              <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/90 backdrop-blur-3xl p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] animate-in fade-in slide-in-from-top-2 duration-300">

                <Link
                  href="/"
                  className={navClass("/")}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                >
                  Home
                </Link>

                <Link
                  href="/library"
                  className={navClass("/library")}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                >
                  Library
                </Link>

                <Link
                  href="/favorites"
                  className={navClass("/favorites")}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                >
                  Favorites
                </Link>

                {user && (

                  <Link
                    href="/profile"
                    className={`${navClass(
                      "/profile"
                    )} flex items-center gap-2`}
                    onClick={() =>
                      setMobileMenu(false)
                    }
                  >

                    <img
                      src={
                        user.user_metadata
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

                {user ? (

                  <button
                    onClick={logout}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-3 rounded-2xl font-semibold transition text-left"
                  >
                    Logout
                  </button>

                ) : (

                  <Link
                    href="/login"
                    className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-4 py-3 rounded-2xl font-semibold transition"
                    onClick={() =>
                      setMobileMenu(false)
                    }
                  >
                    Login
                  </Link>

                )}

              </div>

            </div>

          </div>

        </div>

      </nav>

    </header>
  );
}