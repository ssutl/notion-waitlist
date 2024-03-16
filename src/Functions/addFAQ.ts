export default async function createFAQEntry({
  email,
  question,
}: {
  email: string;
  question: string;
}) {
  const res = await fetch("http://localhost:3000/api/addFAQ", {
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
  return ApiResponse;
}
