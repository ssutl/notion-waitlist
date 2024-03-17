import type { NextApiRequest, NextApiResponse } from "next";
import { CMS_NOTION_PAGE } from "../../../@types/types";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body);
    const response = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_CMS_DATABASE_ID,
      filter: {
        property: "ID",
        unique_id: {
          equals: 4,
        },
      },
    });

    // Check if the page exists in the response
    if (response.results.length === 0) {
      // If no page is found, return a 404 error
      return res.status(404).json({ message: "Waitlist page not found." });
    }

    const WAITLISTPAGEID = response.results[0].id;
    const children_response = await notion.blocks.children.list({
      block_id: WAITLISTPAGEID,
    });

    // Check if there are any children blocks found
    if (children_response.results.length === 0) {
      // If no children blocks are found, return a 404 error
      return res.status(404).json({ message: "Waitlist block not found." });
    }

    const waitlistDBId = children_response.results[0].id;

    // Attempt to create a new page in the database
    const upload_response = await notion.pages.create({
      parent: { database_id: waitlistDBId },
      properties: {
        Email: {
          title: [
            {
              type: "text",
              text: {
                content: req.body.email,
              },
            },
          ],
        },
      },
    });

    // If the above operation is successful, return a success response
    res.status(200).json("Email added to waitlist database successfully!");
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error adding email to waitlist:", error);

    // Respond with a generic 500 server error and provide the error message
    res.status(500).json({
      message: "Failed to add email to waitlist.",
    });
  }
}
