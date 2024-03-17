export default async function retrieveFeatures() {
  try {
    const res = await fetch("http://localhost:3000/api/getFeatures", {
      method: "GET",
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
