export default async function createWaitlistEntry({
  email,
}: {
  email: string;
}) {
  const res = await fetch("http://localhost:3000/api/Waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });
  const ApiResponse = await res.json();
  return ApiResponse;
}
