import React, { useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { FAQ_NOTION_PAGE } from "../../../@types/types";
import retrieveFAQEntries from "@/Functions/getFAQs";

//interface indexProps {}
export const getServerSideProps: GetServerSideProps<{
  FAQContent: FAQ_NOTION_PAGE[];
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const FAQContentResponse = await retrieveFAQEntries();

  return {
    props: {
      FAQContent: FAQContentResponse,
    },
  };
};

export default function FAQ({
  FAQContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(FAQContent);
  return (
    <div className="w-screen flex flex-col overflow-y-scroll">
      {FAQContent.length > 0 ? (
        <>
          <h1>Got Questions?</h1>
          <h1>We have answers</h1>
        </>
      ) : null}
      <h1>hiii</h1>
    </div>
  );
}
