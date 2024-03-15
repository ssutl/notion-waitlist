// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { NotionPage } from "../../../@types/notion";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const WAITLISTPAGEID = response.results[0].id;
  const children_response = await notion.blocks.children.list({
    block_id: WAITLISTPAGEID,
  });
  const waitlistDBId = children_response.results[0].id;

  //Write the question to the faqs database under Question property
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

  res.status(200).json("Email added to waitlist database successfully!");
}
