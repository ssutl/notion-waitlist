import React, { useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NotionPage } from "../../@types/notion";
import getHomePageDetails from "@/Functions/Home";
import createFAQEntry from "@/Functions/FAQ";
import createWaitlistEntry from "@/Functions/Waitlist";

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
          createWaitlistEntry({
            email: "johnmoore@gmail.com",
          });
        }}
      >
        waitlist
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
