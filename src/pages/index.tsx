import React, { useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NotionPage } from "../../@types/notion";
import getHomePageDetails from "@/Functions/Home";
import writeToFaqsDB from "@/Functions/FAQ";

export const getServerSideProps: GetServerSideProps<{
  dashboardContent: NotionPage;
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const dashboardContentResponse = getHomePageDetails();

  return {
    props: {
      dashboardContent: await dashboardContentResponse,
    },
  };
};

export default function Home({
  dashboardContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <button
        onClick={() => {
          writeToFaqsDB({
            email: "johnmoore@gmail.com",
            question: "What is the product?",
          });
        }}
      >
        hello
      </button>
      <h1>
        {dashboardContent.properties["Product Title"].rich_text[0].plain_text}
      </h1>
      <img
        src={dashboardContent.cover.external.url}
        alt={dashboardContent.icon.emoji}
      />
    </>
  );
}
