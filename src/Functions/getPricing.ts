export default async function retrievePricingCards() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBPAGE_URL}/api/getPricing`,
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
