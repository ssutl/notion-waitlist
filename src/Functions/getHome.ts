export default async function getHomePageDetails() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBPAGE_URL}/api/getHome`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}
