const delay = (
  ms: number
) =>
  new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  );

export async function fetchJikan(
  url: string
) {

  try {

    // Small delay to avoid rate limit
    await delay(400);

    const response =
      await fetch(url, {
        next: {
          revalidate: 60,
        },
      });

    // RATE LIMITED
    if (
      response.status ===
      429
    ) {

      console.warn(
        "Jikan rate limited. Retrying..."
      );

      await delay(1500);

      const retry =
        await fetch(url);

      if (!retry.ok) {
        throw new Error(
          `Jikan API Error: ${retry.status}`
        );
      }

      return retry.json();
    }

    // OTHER ERRORS
    if (!response.ok) {
      throw new Error(
        `Jikan API Error: ${response.status}`
      );
    }

    return response.json();

  } catch (error) {

    console.error(
      "Jikan Fetch Error:",
      error
    );

    return {
      data: [],
    };
  }
}