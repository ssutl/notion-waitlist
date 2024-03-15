import React, { useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NotionPage } from "../../@types/notion";
import getHomePageDetails from "@/Functions/Home";
import createFAQEntry from "@/Functions/FAQ";
import createWaitlistEntry from "@/Functions/Waitlist";
import Image from "next/image";

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
}: // ...

InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/2 h-full flex justify-center items-center bg-red-800">
        <Image
          src={dashboardContent.cover.external.url}
          alt={dashboardContent.icon.emoji}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="w-1/2 h-full flex justify-center items-center bg-green-200">
        <h1>
          {dashboardContent.properties["Product Title"].rich_text[0].plain_text}
        </h1>
      </div>
    </div>
  );
}
