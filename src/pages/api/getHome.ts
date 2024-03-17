import type { NextApiRequest, NextApiResponse } from "next";
import { CMS_NOTION_PAGE } from "../../../@types/types";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CMS_NOTION_PAGE | { message: string }>
) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_CMS_DATABASE_ID,
      filter: {
        property: "ID",
        unique_id: {
          equals: 1,
        },
      },
    });

    // Check if any results were returned
    if (response.results.length === 0) {
      // No results found, return a 404 error
      return res.status(404).json({ message: "Page not found." });
    }

    // Return the first result if found
    res.status(200).json(response.results[0]);
  } catch (error) {
    console.error("Error fetching page from Notion:", error);

    // Something went wrong, return a 500 error
    res
      .status(500)
      .json({ message: "Failed to fetch page. Please try again later." });
  }
}
