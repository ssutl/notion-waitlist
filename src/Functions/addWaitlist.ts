export default async function createWaitlistEntry({
  email,
}: {
  email: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WEBPAGE_URL}/api/addWaitlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );
  const ApiResponse = await res.json();
  return ApiResponse;
}
