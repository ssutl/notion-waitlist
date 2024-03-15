export default async function getHomePageDetails() {
  const response = await fetch("http://localhost:3000/api/Home");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}
