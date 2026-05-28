  "use client";

  import {
    useEffect,
    useRef,
    useState,
  } from "react";

  import AnimeCard from "@/components/AnimeCard";
  import Navbar from "@/components/Navbar";
  import toast from "react-hot-toast";

  import {
    getAnimeFeed,
  } from "@/lib/anilist";

  const genres = [
    { name: "Action", id: 1 },
    { name: "Adventure", id: 2 },
    { name: "Comedy", id: 4 },
    { name: "Drama", id: 8 },
    { name: "Fantasy", id: 10 },
    { name: "Horror", id: 14 },
    { name: "Mystery", id: 7 },
    { name: "Romance", id: 22 },
    { name: "Sci-Fi", id: 24 },
    {
      name: "Slice of Life",
      id: 36,
    },
    { name: "Sports", id: 30 },
    {
      name: "Supernatural",
      id: 37,
    },
    { name: "Suspense", id: 41 },
  ];

  export default function HomePage() {
    const [animeList, setAnimeList] =
      useState<any[]>([]);

    const [loading, setLoading] =
      useState(true);

    const [
      loadingMore,
      setLoadingMore,
    ] = useState(false);

    const [search, setSearch] =
      useState("");

    const [page, setPage] =
      useState(2);

    const [
      hasMore,
      setHasMore,
    ] = useState(true);

    const [
      suggestions,
      setSuggestions,
    ] = useState<any[]>([]);

    const [pageTitle, setPageTitle] =
      useState("Trending Now");

    const [
      selectedStatus,
      setSelectedStatus,
    ] = useState("");

    const [
      selectedSort,
      setSelectedSort,
    ] = useState("");

    const [
      selectedGenres,
      setSelectedGenres,
    ] = useState<string[]>([]);

    const [
      showGenreFilter,
      setShowGenreFilter,
    ] = useState(false);

    const timeoutRef =
      useRef<NodeJS.Timeout | null>(
        null
      );

    // LOAD TRENDING
    useEffect(() => {
      loadAnime();
    }, []);

useEffect(() => {

  const delay =
    setTimeout(() => {

      if (
        search.trim()
      ) {

        setPage(1);

        searchAnime(true);

      }

    }, 800);

  return () =>
    clearTimeout(delay);

}, [search]);


useEffect(() => {

  const delay =
    setTimeout(() => {

      if (
        search.trim()
      ) {

        searchAnime(true);

      } else {

        loadAnime();

      }

    }, 500);

  return () =>
    clearTimeout(delay);

}, [search]);

    // AUTO SEARCH
    useEffect(() => {
      setPage(1);

      searchAnime(true);
    }, [
      selectedGenres,
      selectedStatus,
      selectedSort,
    ]);

    async function loadAnime() {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const anime =
          await getAnimeFeed(
            "POPULARITY_DESC"
          );

        if (
          anime &&
          anime.length > 0
        ) {
          setAnimeList(anime);
        }

        setPageTitle(
          "Trending Now"
        );

        setHasMore(true);
      } catch (error) {
        console.error(
          "LOAD ANIME ERROR:",
          error
        );
      }

      setLoading(false);
      setLoadingMore(false);
    }

    async function searchTrendingMore() {

      if (loadingMore)
    return;

      setLoadingMore(true);

      try {
        const response =
          await fetch(
            `https://api.jikan.moe/v4/top/anime?page=${page}&limit=24`
          );

        const json =
          await response.json();

        const newAnime =
          json.data || [];

        setHasMore(
          json.pagination
            ?.has_next_page
        );

        setAnimeList(
          (prev) => [
            ...prev,
            ...newAnime,
          ]
        );

        setPage(page + 1);
      } catch (error) {
        console.error(error);
      }

      setLoadingMore(false);
    }

    async function searchAnime(
    reset = false
  ) {

    // TRENDING
    if (
      !search.trim() &&
      selectedGenres.length ===
        0 &&
      !selectedStatus &&
      !selectedSort
    ) {

      if (reset) {

        setPage(2);

        loadAnime();

      } else {

        searchTrendingMore();

      }

      return;
    }

    // LOADING
    if (reset) {

      setLoading(true);

    } else {

      setLoadingMore(true);

    }

    try {

      const currentPage =
        reset ? 1 : page;

      let url =
        `https://api.jikan.moe/v4/anime?page=${currentPage}&limit=24`;

      // SEARCH
      if (search.trim()) {

        url += `&q=${search}`;

      }

      // STATUS
      if (
        selectedStatus
      ) {

        url += `&status=${selectedStatus}`;

      }

      // GENRES
      if (
        selectedGenres.length >
        0
      ) {

        const genreIds =
          genres
            .filter((g) =>
              selectedGenres.includes(
                g.name
              )
            )
            .map((g) => g.id)
            .join(",");

        url += `&genres=${genreIds}`;
      }

// SORT

if (
  selectedSort ===
  "favorites"
) {

  url +=
    "&order_by=favorites&sort=desc";

}

else if (
  selectedSort ===
  "score"
) {

  url +=
    "&order_by=score&sort=desc";

}

else if (
  selectedSort ===
  "start_date"
) {

  url +=
    "&order_by=start_date&sort=desc";

}

else if (
  selectedSort ===
  "popularity"
) {

  url +=
    "&order_by=popularity&sort=asc";

}

else if (
  selectedSort ===
  "members"
) {

  url +=
    "&order_by=members&sort=desc";

}

else {

  url +=
    "&order_by=members&sort=desc";

}

      const response =
    await fetch(url);

  if (
    response.status === 429
  ) {

    toast.error(
      "Too many requests. Please wait a moment."
    );

    setLoading(false);

    setLoadingMore(false);

    return;
  }
      const json =
        await response.json();

      const newAnime =
        json.data || [];

      setHasMore(
        json.pagination
          ?.has_next_page
      );

      if (reset) {

        setAnimeList(
          newAnime
        );

      } else {

        setAnimeList(
          (prev) => [
            ...prev,
            ...newAnime,
          ]
        );

      }

      setPage(
        currentPage + 1
      );

      setPageTitle(
        search.trim()
          ? `Search Results for "${search}"`
          : "Filtered Anime"
      );

    } catch (error) {

      console.error(
        "SEARCH ERROR:",
        error
      );

    }

    setLoading(false);

    setLoadingMore(false);
  }

    async function fetchSuggestions(
      value: string
    ) {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );
      }

      timeoutRef.current =
        setTimeout(
          async () => {
            if (
              !value.trim() ||
              value.length < 2
            ) {
              setSuggestions(
                []
              );
              return;
            }

            try {
              const response =
                await fetch(
                  `https://api.jikan.moe/v4/anime?q=${value}&order_by=members&sort=desc&type=tv&limit=8`
                );

  if (
    response.status === 429
  ) {

    setSuggestions([]);

    return;
  }

              const json =
                await response.json();

              const filtered =
                (
                  json.data ||
                  []
                ).filter(
                  (
                    anime: any
                  ) =>
                    anime.title
                      ?.toLowerCase()
                      .includes(
                        value.toLowerCase()
                      ) ||
                    anime.title_english
                      ?.toLowerCase()
                      .includes(
                        value.toLowerCase()
                      )
                );

              setSuggestions(
                filtered
              );
            } catch (error) {
              console.error(
                error
              );
            }
          },
          800
        );
    }

    function toggleGenre(
      genre: string
    ) {
      setSelectedGenres(
        (prev) =>
          prev.includes(
            genre
          )
            ? prev.filter(
                (g) =>
                  g !==
                  genre
              )
            : [
                ...prev,
                genre,
              ]
      );
    }

    return (
      <main className="min-h-screen bg-black text-white pt-28">
        <Navbar />

        {/* HERO */}
        <section className="relative pt-40 pb-24 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-violet-700/20 blur-[180px] rounded-full pointer-events-none" />

          <div className="relative max-w-7xl mx-auto text-center">
            {/* TITLE */}
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Discover Anime
            </h1>

            {/* DESCRIPTION */}
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-9 mb-12">
              Track anime,
              build your
              library, rate
              your favorites,
              and explore
              trending shows.
            </p>

            {/* SEARCH + FILTERS */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 max-w-7xl mx-auto">

              {/* LEFT FILTERS */}
              <div className="flex items-center gap-4">

                {/* GENRE */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowGenreFilter(
                        !showGenreFilter
                      )
                    }
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 font-semibold hover:border-violet-500 transition h-[58px]"
                  >
                    Genre{" "}
                    {selectedGenres.length >
                      0 &&
                      `(${selectedGenres.length})`}
                  </button>

                  {showGenreFilter && (
                    <div className="absolute top-full mt-3 left-0 bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 w-[500px] shadow-[0_20px_80px_rgba(0,0,0,0.6)] z-50">
                      <div className="grid grid-cols-3 gap-4">
                        {genres.map(
                          (
                            genre
                          ) => (
                            <label
                              key={
                                genre.id
                              }
                              className="flex items-center gap-3 text-sm cursor-pointer hover:text-violet-300 transition"
                            >
                              <input
                                type="checkbox"
                                checked={selectedGenres.includes(
                                  genre.name
                                )}
                                onChange={() =>
                                  toggleGenre(
                                    genre.name
                                  )
                                }
                                className="accent-violet-500"
                              />

                              {
                                genre.name
                              }
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <select
                  value={
                    selectedStatus
                  }
                  onChange={(
                    e
                  ) =>
                    setSelectedStatus(
                      e.target
                        .value
                    )
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none h-[58px]"
                >
                  <option value="">
                    Status All
                  </option>

                  <option value="airing">
                    Airing
                  </option>

                  <option value="complete">
                    Finished
                  </option>

                  <option value="upcoming">
                    Upcoming
                  </option>
                </select>

                {/* SORT */}
                <select
                  value={
                    selectedSort
                  }
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value
                    )
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none h-[58px]"
                >
                  <option value="">
                    Trending
                  </option>

                  <option value="popularity">
                    Most Popular
                  </option>

                  <option value="favorites">
                    Favorites
                  </option>

                  <option value="score">
                    Top Rated
                  </option>

                  <option value="start_date">
                    Newest
                  </option>

                </select>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {

  const value =
    e.target.value;

  setSearch(value);

  fetchSuggestions(value);

}}
                  placeholder="Search anime..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 h-[58px]"
                />

                {/* SUGGESTIONS */}
                {suggestions.length >
                  0 && (
                  <div className="absolute top-full mt-3 w-full max-h-[420px] overflow-y-auto bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl z-50 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                    {suggestions.map(
                      (
                        anime: any
                      ) => (
                        <button
                          key={
                            anime.mal_id
                          }
                          onClick={() => {

    const title =
      anime.title;

    setSearch(title);

    setSuggestions([]);

    setPage(1);

    setTimeout(() => {
      searchAnime(true);
    }, 0);

  }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition text-left border-b border-white/5 last:border-none group"
                        >
                          <div className="relative">
                            <img
                              src={
                                anime
                                  .images
                                  ?.jpg
                                  ?.image_url
                              }
                              alt=""
                              className="w-14 h-20 object-cover rounded-xl"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-black text-white line-clamp-1 group-hover:text-violet-300 transition">
                              {
                                anime.title
                              }
                            </p>
                          </div>

                          <div className="text-violet-400 opacity-0 group-hover:opacity-100 transition text-lg font-bold">
                            →
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* SEARCH BUTTON */}
              <button
                type="button"
                onClick={() => {

    if (loading || loadingMore)
      return;

    setSuggestions([]);

    setPage(1);

    searchAnime(true);
  }}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 px-8 py-4 rounded-2xl font-bold transition h-[58px]"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="mb-12">
            <h2 className="text-5xl font-black mb-3">
              {pageTitle}
            </h2>

            <p className="text-zinc-400 text-lg">
              Most popular anime
              right now
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <h2 className="text-4xl font-black">
                Loading...
              </h2>
            </div>
          ) : animeList.length ===
            0 ? (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-16 text-center text-zinc-400">
              No anime found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {animeList.map(
                  (
                    anime: any,
                    index: number
                  ) => (
                    <AnimeCard
                      key={`${anime.mal_id}-${index}`}
                      anime={anime}
                    />
                  )
                )}
              </div>

              {/* LOAD MORE */}
              {hasMore && (
                <div className="flex justify-center mt-16">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      if (
                        !search.trim() &&
                        selectedGenres.length ===
                          0 &&
                        !selectedStatus &&
                        !selectedSort
                      ) {
                        searchTrendingMore();
                      } else {
                        searchAnime();
                      }
                    }}
                    disabled={
                      loadingMore
                    }
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loadingMore
                      ? "Loading..."
                      : "Show More"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    );
  }