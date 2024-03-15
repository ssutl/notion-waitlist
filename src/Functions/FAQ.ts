export default async function getHomePageDetails({
  email,
  question,
}: {
  email: string;
  question: string;
}) {
  const res = await fetch("http://localhost:3000/api/FAQ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      question,
    }),
  });
  const faqContent = await res.json();
  return faqContent;
}
