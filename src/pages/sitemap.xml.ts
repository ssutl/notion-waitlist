const URL = process.env.NEXT_PUBLIC_WEBPAGE_URL;

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     <url>
       <loc>${URL}</loc>
       <priority>1.00</priority>
     </url>
     <url>
       <loc>${URL}/FAQs</loc>
      <priority>0.80</priority>
     </url>
      <url>
       <loc>${URL}/Features</loc>
      <priority>0.80</priority>
     </url>
   </urlset>
 `;
}

export async function getServerSideProps({ res }: { res: any }) {
  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {}
