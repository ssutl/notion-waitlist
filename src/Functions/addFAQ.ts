export default async function createFAQEntry({
  email,
  question,
}: {
  email: string;
  question: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBPAGE_URL}/api/addFAQ`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      question,
    }),
  });
  const ApiResponse = await res.json();
  console.log(ApiResponse);
  return ApiResponse;
}
