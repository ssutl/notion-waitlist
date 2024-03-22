import type { NextApiRequest, NextApiResponse } from "next";
const { Client } = require("@notionhq/client");

// Initialize the Notion client
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
    // Query the database for the specific ID
    const response2 = await notion.databases.query({
      database_id: responseID,
      filter: {
        property: "‼️ PageNo.",
        number: {
          equals: 4,
        },
      },
    });

    if (response2.results.length === 0) {
      return res.status(404).json({ message: "Page not found." });
    }

    const FAQPAGEID = response2.results[0].id;
    const children_response = await notion.blocks.children.list({
      block_id: FAQPAGEID,
    });

    if (children_response.results.length === 0) {
      return res.status(404).json({ message: "FAQ block not found." });
    }

    const faqsDBId = children_response.results[0].id;

    // Write the question to the FAQs database
    const upload_response = await notion.pages.create({
      parent: { database_id: faqsDBId },
      properties: {
        Question: {
          title: [
            {
              type: "text",
              text: {
                content: req.body.question,
              },
            },
          ],
        },
        Email: {
          email: req.body.email,
        },
      },
    });

    res.status(200).json("Question added to FAQs database successfully!");
  } catch (error) {
    console.error("Error adding question to FAQs database:", error);

    // Respond with a 500 error and error message
    res.status(500).json({
      message: "Failed to add question to FAQs database.",
    });
  }
}
