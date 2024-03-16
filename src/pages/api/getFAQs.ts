// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_NOTION_CMS_DATABASE_ID,
    filter: {
      property: "ID",
      unique_id: {
        equals: 2,
      },
    },
  });

  const FAQPAGEID = response.results[0].id;
  const children_response = await notion.blocks.children.list({
    block_id: FAQPAGEID,
  });
  const faqsDBId = children_response.results[0].id;

  //Read all the FAQs which have the tag display and check box true
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
}
