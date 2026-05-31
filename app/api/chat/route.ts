const watchOrders: {
  [key: string]: string;
} = {

  fate:
`Fate Watch Order:

1. Fate/Zero
2. Fate/Stay Night: Unlimited Blade Works
3. Fate/Stay Night: Heaven's Feel

Optional:
• Fate/Apocrypha
• Fate/Grand Order
• Fate/Extra`,

  monogatari:
`Monogatari Watch Order:

1. Bakemonogatari
2. Nisemonogatari
3. Nekomonogatari
4. Monogatari Second Season
5. Hanamonogatari
6. Tsukimonogatari
7. Owarimonogatari
8. Zoku Owarimonogatari`,

};

const curatedRecommendations: {
  [key: string]: string[];
} = {

  "yu gi oh": [
    "Cardfight!! Vanguard",
    "Bakugan",
    "Beyblade",
    "Duel Masters",
    "Digimon Tamers",
  ],

  monster: [
    "Pluto",
    "Death Note",
    "Psycho-Pass",
    "Erased",
    "Paranoia Agent",
  ],

  naruto: [
    "Bleach",
    "Black Clover",
    "Hunter x Hunter",
    "One Piece",
    "Jujutsu Kaisen",
  ],

  "attack on titan": [
    "86",
    "Code Geass",
    "Vinland Saga",
    "Kabaneri of the Iron Fortress",
    "Fullmetal Alchemist Brotherhood",
  ],

  "blue lock": [
    "Haikyuu",
    "Ao Ashi",
    "Kuroko no Basket",
    "Slam Dunk",
    "Days",
  ],

  "jujutsu kaisen": [
    "Chainsaw Man",
    "Bleach",
    "Hell's Paradise",
    "Demon Slayer",
    "Blue Exorcist",
  ],

};

const genreMap: {
  [key: string]: number;
} = {

  action: 1,
  adventure: 2,
  comedy: 4,
  mystery: 7,
  drama: 8,
  fantasy: 10,
  horror: 14,
  romance: 22,
  scifi: 24,
  sports: 30,

};

async function fetchJSON(
  url: string
) {

  const response =
    await fetch(url);

  if (!response.ok) {

    throw new Error(
      "Failed request"
    );

  }

  return response.json();

}

async function searchAnime(
  query: string
) {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&type=tv&limit=10`
    );

  if (
    !data.data ||
    data.data.length === 0
  ) {

    return null;

  }

  const exactMatch =
    data.data.find(
      (anime: any) =>

        anime.title
          ?.toLowerCase()
          .includes(
            query.toLowerCase()
          )
    );

  return (
    exactMatch ||
    data.data[0]
  );

}

async function getRecommendations(
  malId: number
) {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/anime/${malId}/recommendations`
    );

  return (
    data.data || []
  )
    .slice(0, 6)
    .map(
      (item: any) =>
        item.entry.title
    );

}

async function getSeasonalAnime() {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/seasons/now`
    );

  return (
    data.data || []
  )
    .sort(
      (a: any, b: any) =>
        (b.score || 0) -
        (a.score || 0)
    )
    .slice(0, 6)
    .map(
      (anime: any) =>
        anime.title
    );

}

async function getTopAnime() {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/top/anime`
    );

  return (
    data.data || []
  )
    .slice(0, 6)
    .map(
      (anime: any) =>
        anime.title
    );

}

async function getPopularAnime() {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/top/anime?filter=bypopularity`
    );

  return (
    data.data || []
  )
    .slice(0, 6)
    .map(
      (anime: any) =>
        anime.title
    );

}

async function getTopMovies() {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/top/anime?type=movie`
    );

  return (
    data.data || []
  )
    .slice(0, 6)
    .map(
      (anime: any) =>
        anime.title
    );

}

async function getGenreAnime(
  genreId: number
) {

  const data =
    await fetchJSON(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=6`
    );

  return (
    data.data || []
  )
    .slice(0, 6)
    .map(
      (anime: any) =>
        anime.title
    );

}

function cleanMessage(
  message: string
) {

  return message
    .toLowerCase()
    .replace("-", " ")
    .trim();

}

function bulletList(
  items: string[]
) {

  return items
    .map(
      (item) =>
        `• ${item}`
    )
    .join("\n");

}

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const userMessage =
      cleanMessage(
        body.messages?.[
          body.messages.length - 1
        ]?.content || ""
      );

    // WATCH ORDERS
    if (
      userMessage.includes(
        "watch order"
      )
    ) {

      if (
        userMessage.includes(
          "fate"
        )
      ) {

        return Response.json({
          message:
            watchOrders.fate,
        });

      }

      if (
        userMessage.includes(
          "monogatari"
        )
      ) {

        return Response.json({
          message:
            watchOrders.monogatari,
        });

      }

      return Response.json({
        message:
`I currently support:

• Fate watch order
• Monogatari watch order`,
      });

    }

    // BEST THIS SEASON
    if (

      userMessage.includes(
        "best anime this season"
      ) ||

      userMessage.includes(
        "best this season"
      ) ||

      userMessage.includes(
        "top airing anime"
      ) ||

      userMessage.includes(
        "seasonal anime"
      )

    ) {

      const seasonal =
        await getSeasonalAnime();

      return Response.json({
        message:
`Top anime this season:

${bulletList(
  seasonal
)}`,
      });

    }

// TOP ANIME MOVIES
if (

  userMessage.includes(
    "anime movies"
  ) ||

  userMessage.includes(
    "top anime movies"
  ) ||

  userMessage.includes(
    "best anime movies"
  ) ||

  userMessage.includes(
    "movie anime"
  )

) {

  const movies =
    await getTopMovies();

  return Response.json({
    message:
`Top anime movies:

${bulletList(
  movies
)}`,
  });

}

    // TOP RATED ANIME
    if (

      userMessage.includes(
        "top anime"
      ) ||

      userMessage.includes(
        "best anime"
      ) ||

      userMessage.includes(
        "top rated anime"
      )

    ) {

      const topAnime =
        await getTopAnime();

      return Response.json({
        message:
`Top rated anime:

${bulletList(
  topAnime
)}`,
      });

    }

    // MOST POPULAR ANIME
    if (

      userMessage.includes(
        "top popular anime"
      ) ||

      userMessage.includes(
        "most popular anime"
      ) ||

      userMessage.includes(
        "popular anime"
      )

    ) {

      const popular =
        await getPopularAnime();

      return Response.json({
        message:
`Most popular anime:

${bulletList(
  popular
)}`,
      });

    }

    // GENRE REQUESTS
    for (
      const genre in genreMap
    ) {

      if (
        userMessage.includes(
          genre
        )
      ) {

        const anime =
          await getGenreAnime(
            genreMap[
              genre
            ]
          );

        return Response.json({
          message:
`Top ${genre} anime:

${bulletList(
  anime
)}`,
        });

      }

    }

    // SIMILAR / LIKE
    if (

      userMessage.includes(
        "like"
      ) ||

      userMessage.includes(
        "similar to"
      )

    ) {

      let animeName =
        "";

      if (
        userMessage.includes(
          "like"
        )
      ) {

        animeName =
          userMessage
            .split(
              "like"
            )
            .pop()
            ?.trim() || "";

      }

      if (
        userMessage.includes(
          "similar to"
        )
      ) {

        animeName =
          userMessage
            .split(
              "similar to"
            )
            .pop()
            ?.trim() || "";

      }

      // CURATED RECOMMENDATIONS FIRST
      for (
        const key in curatedRecommendations
      ) {

        if (
          animeName.includes(
            key
          )
        ) {

          return Response.json({
            message:
`If you liked ${key}, try:

${bulletList(
  curatedRecommendations[
    key
  ]
)}

These are hand-picked recommendations ✨`,
          });

        }

      }

      // JIKAN RECOMMENDATIONS
      const anime =
        await searchAnime(
          animeName
        );

      if (!anime) {

        return Response.json({
          message:
            "I couldn't find that anime 😭",
        });

      }

      const recommendations =
        await getRecommendations(
          anime.mal_id
        );

      if (
        recommendations.length ===
        0
      ) {

        return Response.json({
          message:
            `No recommendations found for ${anime.title} 😭`,
        });

      }

      return Response.json({
        message:
`If you liked ${anime.title}, try:

${bulletList(
  recommendations
)}

These anime have similar themes, atmosphere, or storytelling.`,
      });

    }

    // DEFAULT
    return Response.json({
      message:
`Ask me things like:

• anime like Monster
• anime like Yu-Gi-Oh
• similar to Naruto
• top romance anime
• top rated anime
• most popular anime
• best anime this season
• Fate watch order
• top sports anime
• top fantasy anime`,
    });

  } catch (error) {

    console.error(
      "OTAKU AI ERROR:",
      error
    );

    return Response.json(
      {
        message:
          "Otaku AI is resting 🌙 Try again soon.",
      },
      {
        status: 500,
      }
    );

  }

}