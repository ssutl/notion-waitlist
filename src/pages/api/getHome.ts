// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CMS_NOTION_PAGE } from "../../../@types/types";
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CMS_NOTION_PAGE>
) {
  const response = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_NOTION_CMS_DATABASE_ID,
    filter: {
      property: "ID",
      unique_id: {
        equals: 1,
      },
    },
  });
  res.status(200).json(response.results[0]);
}
