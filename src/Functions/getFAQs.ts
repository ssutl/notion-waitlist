export default async function retrieveFAQEntries() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBPAGE_URL}/api/getFAQs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const ApiResponse = await res.json();
    return ApiResponse;
  } catch (err) {
    return null;
  }
}
