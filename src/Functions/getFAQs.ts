export default async function retrieveFAQEntries() {
  try {
    const res = await fetch("http://localhost:3000/api/getFAQs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ApiResponse = await res.json();
    return ApiResponse;
  } catch (err) {
    return null;
  }
}
