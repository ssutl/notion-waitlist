import type { NextApiRequest, NextApiResponse } from "next";
const { Client } = require("@notionhq/client");
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const response = await notion.search({
      query: "Landing page",
      filter: {
        value: "database",
        property: "object",
      },
    });

    const removeDashes = (id: string) => id.replace(/-/g, "");

    const responseID = removeDashes(response.results[0].id);

    const response2 = await notion.databases.query({
      database_id: responseID,
      filter: {
        property: "‼️ PageNo.",
        number: {
          equals: 5,
        },
      },
    });

    // Check if the FAQ page exists
    if (response2.results.length === 0) {
      return res.status(404).json({ message: "FAQ page not found." });
    }

    const PRICEPAGEID = response2.results[0].id;
    console.log("!!!!!!!!!!!", PRICEPAGEID);

    const mdblocks = await n2m.pageToMarkdown(PRICEPAGEID);
    const mdString = n2m.toMarkdownString(mdblocks);
    res.status(200).json(mdString.parent);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs." });
  }
}
