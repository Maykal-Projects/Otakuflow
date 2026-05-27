export function getGuestLibrary() {
  return JSON.parse(
    localStorage.getItem(
      "guest_library"
    ) || "[]"
  );
}

export function saveGuestLibrary(
  library: any[]
) {
  localStorage.setItem(
    "guest_library",
    JSON.stringify(library)
  );
}