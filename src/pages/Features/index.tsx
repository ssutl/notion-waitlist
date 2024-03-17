import React, { useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { FEATURE_NOTION_PAGE } from "../../../@types/types";
import retrieveFeatures from "@/Functions/getFeatures";
import Image from "next/image";

//interface indexProps {}
export const getServerSideProps: GetServerSideProps<{
  FeaturesContent: FEATURE_NOTION_PAGE[];
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const FeaturesContentResponse = await retrieveFeatures();

  return {
    props: {
      FeaturesContent: FeaturesContentResponse,
    },
  };
};

export default function Features({
  FeaturesContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="w-screen py-14 px-10 lg:px-12">
      {FeaturesContent.length ? (
        FeaturesContent.map((feature, index) => {
          return (
            <div
              key={index}
              className="mb-14 lg:flex lg:flex-row lg:justify-between"
            >
              <div className="h-72 w-full relative rounded-md overflow-hidden mb-10 md:mb-8 md:h-96 lg:w-2/5">
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
                  {feature.properties.Name.title[0].plain_text}
                </h1>
                <p className="text-base mb-5 md:text-xl">
                  {feature.properties.Description.rich_text[0].plain_text}
                </p>
                <p className="text-base mb-5 md:text-xl">
                  {new Date(
                    feature.properties.Date.date.start
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <div className="w-full flex">
                  {feature.properties.Tags.multi_select.map((tag, index) => {
                    return (
                      <p
                        key={index}
                        className="w-fit bg-gray-200 rounded-md px-2 py-1 mr-4 text-base md:text-xl"
                      >
                        {tag.name}
                      </p>
                    );
                  })}
                </div>
              </span>
            </div>
          );
        })
      ) : (
        <h1>Feature list coming soon!</h1>
      )}
    </div>
  );
}
