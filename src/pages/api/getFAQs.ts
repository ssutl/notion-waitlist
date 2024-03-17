import type { NextApiRequest, NextApiResponse } from "next";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_CMS_DATABASE_ID,
      filter: {
        property: "ID",
        unique_id: {
          equals: 2,
        },
      },
    });

    // Check if the FAQ page exists
    if (response.results.length === 0) {
      return res.status(404).json({ message: "FAQ page not found." });
    }

    const FAQPAGEID = response.results[0].id;
    const children_response = await notion.blocks.children.list({
      block_id: FAQPAGEID,
    });

    // Check if there are children blocks in the FAQ page
    if (children_response.results.length === 0) {
      return res.status(404).json({ message: "FAQ section not found." });
    }

    const faqsDBId = children_response.results[0].id;

    // Query the FAQs database for entries marked for display
    const FAQDB = await notion.databases.query({
      database_id: faqsDBId,
      filter: {
        property: "Display",
        checkbox: {
          equals: true,
        },
      },
    });

    res.status(200).json(FAQDB.results);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs." });
  }
}
