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
    const response = await notion.search({
      query: "Landing page",
      filter: {
        value: "database",
        property: "object",
      },
    });

    const removeDashes = (id: string) => id.replace(/-/g, "");

    const responseID = removeDashes(response.results[0].id);
    // Attempt to query the main database to find the specific page
    const response2 = await notion.databases.query({
      database_id: responseID,
      filter: {
        property: "ID",
        unique_id: {
          equals: 3, // Make sure this value is correct for the ID you're trying to match
        },
      },
    });

    // Check if the page is found
    if (response2.results.length === 0) {
      return res.status(404).json({ message: "Features page not found." });
    }

    const FEATURESPAGEID = response2.results[0].id;
    const children_response = await notion.blocks.children.list({
      block_id: FEATURESPAGEID,
    });

    // Check if there are any children blocks
    if (children_response.results.length === 0) {
      return res.status(404).json({ message: "Features block not found." });
    }

    const galleryID = children_response.results[0].id;

    // Query the nested database for published items
    const FAQDB = await notion.databases.query({
      database_id: galleryID,
      filter: {
        property: "Publish",
        checkbox: {
          equals: true,
        },
      },
    });

    // Successfully return the filtered results
    res.status(200).json(FAQDB.results);
  } catch (error) {
    console.error("Error fetching features from Notion:", error);
    // Respond with a server error and the error message
    res.status(500).json({ message: "Failed to fetch features." });
  }
}
