export async function searchAnime(
  search: string,
  genre?: string
) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${search}`
    );

    const json =
      await response.json();

    let anime =
      json.data || [];

    if (genre) {
      anime = anime.filter(
        (item: any) =>
          item.genres?.some(
            (g: any) =>
              g.name === genre
          )
      );
    }

    return anime;
  } catch (error) {
    console.error(error);

    return [];
  }
}

export async function getAnimeFeed(
  sortType: string,
  genre?: string
) {
  try {
    let endpoint =
      "https://api.jikan.moe/v4/seasons/now";

    // TOP RATED
    if (
      sortType ===
      "SCORE_DESC"
    ) {
      endpoint =
        "https://api.jikan.moe/v4/top/anime";
    }

    const response = await fetch(
      endpoint
    );

    const json =
      await response.json();

    let anime =
      json.data || [];

    if (genre) {
      anime = anime.filter(
        (item: any) =>
          item.genres?.some(
            (g: any) =>
              g.name === genre
          )
      );
    }

    return anime;
  } catch (error) {
    console.error(error);

    return [];
  }
}