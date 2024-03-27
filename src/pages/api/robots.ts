export default function handler(req: any, res: any) {
  const sitemapUrl = `${process.env.NEXT_PUBLIC_WEBPAGE_URL}/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}`); // Include the Sitemap directive
}
