import React, { useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CMS_NOTION_PAGE, FEATURE_NOTION_PAGE } from "../../../@types/types";
import retrieveFeatures from "@/Functions/getFeatures";
import Image from "next/image";
import Head from "next/head";
import getHomePageDetails from "@/Functions/getHome";

//interface indexProps {}
export const getServerSideProps: GetServerSideProps<{
  FeaturesContent: FEATURE_NOTION_PAGE[];
  dashboardContent: CMS_NOTION_PAGE;
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const FeaturesContentResponse = await retrieveFeatures();
  const dashboardContentResponse = await getHomePageDetails();

  return {
    props: {
      FeaturesContent: FeaturesContentResponse,
      dashboardContent: dashboardContentResponse,
    },
  };
};

const renderWithLineBreaks = (text: string) => {
  return text
    .split("\n")
    .map((line: string, index: number, array: string[]) => (
      <p className="text-base mb-3 md:text-2xl" key={index}>
        {line}
      </p>
    ));
};

export default function Features({
  FeaturesContent,
  dashboardContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>
          {dashboardContent.properties["Product name"].rich_text[0].plain_text}{" "}
          - Features
        </title>
        <meta
          name="description"
          content={
            dashboardContent.properties["Description"].rich_text[0].plain_text
          }
        />
        <meta
          property="og:title"
          content={
            dashboardContent.properties["Product name"].rich_text[0].plain_text
          }
        />
        <meta
          property="og:description"
          content={
            dashboardContent.properties["Description"].rich_text[0].plain_text
          }
        />
        <meta
          property="og:image"
          content={
            dashboardContent.cover.external
              ? dashboardContent.cover.external.url
              : dashboardContent.cover.file.url
          }
        />
        <meta
          property="og:url"
          content={dashboardContent.properties["Released product website"].url}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="w-full py-14 px-10 lg:px-12">
        {FeaturesContent.length ? (
          FeaturesContent.slice()
            .sort((a, b) => {
              return (
                new Date(b.properties.Date.date.start).getTime() -
                new Date(a.properties.Date.date.start).getTime()
              );
            })
            .map((feature, index) => {
              return (
                <div
                  key={index}
                  className="mb-14 lg:flex lg:flex-row lg:justify-between"
                >
                  <div className="h-72 w-full relative rounded-md overflow-hidden mb-10 md:mb-8 md:h-96 lg:w-2/5 flex items-center justify-center">
                    <Image
                      src={
                        feature.cover.file
                          ? feature.cover.file.url
                          : feature.cover.external.url
                      }
                      alt="Picture of the author"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <span className="lg:w-11/20">
                    <h1 className="text-4xl font-semibold mb-5 md:mb-6 md:text-5xl">
                      {feature.properties.Name.title.length > 0
                        ? feature.properties.Name.title[0].plain_text
                        : "Title"}
                    </h1>
                    {feature.properties.Description.rich_text.length > 0
                      ? renderWithLineBreaks(
                          feature.properties.Description.rich_text[0].plain_text
                        )
                      : "Description"}
                    <p className="text-base mb-5 md:text-xl">
                      {feature.properties.Date.date !== null &&
                        new Date(
                          feature.properties.Date.date.start
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                    </p>
                    <div className="w-full flex">
                      {feature.properties.Tags.multi_select.map(
                        (tag, index) => {
                          return (
                            <p
                              key={index}
                              className="w-fit bg-gray-200 rounded-md px-2 py-1 mr-4 text-base md:text-xl"
                            >
                              {tag.name}
                            </p>
                          );
                        }
                      )}
                    </div>
                  </span>
                </div>
              );
            })
        ) : (
          <>
            <h1 className="text-4xl font-semibold mb-10 md:text-5xl md:mb-8">
              New features being added soon!
            </h1>
            <h1 className="text-4xl font-semibold mb-10 md:text-5xl md:mb-8">
              You&apos;re in the right place, stay tuned!
            </h1>
          </>
        )}
      </div>
    </>
  );
}
