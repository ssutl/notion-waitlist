import React, { useRef } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CMS_NOTION_PAGE } from "../../@types/types";
import getHomePageDetails from "@/Functions/getHome";
import createFAQEntry from "@/Functions/addFAQ";
import createWaitlistEntry from "@/Functions/addWaitlist";
import Image from "next/image";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<{
  dashboardContent: CMS_NOTION_PAGE;
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const dashboardContentResponse = await getHomePageDetails();

  return {
    props: {
      dashboardContent: dashboardContentResponse,
    },
  };
};

export default function Home({
  dashboardContent,
}: // ...
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(emailRef.current?.value); // Logs the value of the input field
    if (emailRef.current?.value)
      createWaitlistEntry({ email: emailRef.current.value });
  };

  return (
    <div className="w-screen flex flex-col overflow-y-scroll">
      <div className="w-full h-96 flex items-center relative bg-black">
        <Image
          src={
            dashboardContent.cover.external
              ? dashboardContent.cover.external.url
              : dashboardContent.cover.file.url
          }
          alt={dashboardContent.icon.emoji}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-full py-14 px-10 flex flex-col items-start">
        <h1 className="text-4xl font-semibold mb-10">
          {dashboardContent.properties["Main text"].rich_text[0]
            ? dashboardContent.properties["Main text"].rich_text[0].plain_text
            : "Welcome to the dashboard, change the Main Text property in Notion to see the changes here!"}
        </h1>
        <p className="text-base mb-10">
          {dashboardContent.properties["Description"].rich_text[0]
            ? dashboardContent.properties["Description"].rich_text[0].plain_text
            : "This is the description, change the Description property in Notion to see the changes here!"}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type={"email"}
            placeholder={"Johndoe@example.com"}
            ref={emailRef}
            required
            className="w-full h-14 outline outline-1  outline-slate-400 rounded-md mb-3 p-2.5"
          />
          <button
            type="submit"
            className="w-full h-14 bg-black text-white rounded-md font-semibold mb-8"
          >
            Join the waitlist
          </button>
        </form>
        {dashboardContent.properties.Instagram.url ||
        dashboardContent.properties.X.url ||
        dashboardContent.properties.Youtube ? (
          <div className="w-full flex justify-start items-center relative mb-12">
            {Object.keys(dashboardContent.properties).map((social, key) => {
              if (
                social === "Instagram" ||
                social === "X" ||
                social === "Youtube"
              ) {
                return (
                  <a
                    key={key}
                    href={dashboardContent.properties[social].url ?? ""}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={`/Socials/${social}.png`}
                      alt={social}
                      width={50}
                      height={50}
                      className="mr-4 w-9"
                    />
                  </a>
                );
              }
            })}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold mb-4 text-left">
          Not convinced?
        </h1>
        <p className="mb-4">
          There&apos;s way more to be excited about, checkout our features page
          to see more!
        </p>
        <h1 onClick={() => router.push("/Features")} className="mb-10 text-xl">
          Read Features ↗
        </h1>
        <h1 className="text-2xl font-semibold mb-4 text-left">
          Still got questions?
        </h1>
        <p className="mb-4">
          Got any questions or suggestions, head to the FAQ page and we&apos;ll
          get back to you!
        </p>
        <h1 onClick={() => router.push("/FAQs")} className="mb-10 text-xl">
          Read FAQ ↗
        </h1>
        <div className="w-full flex justify-center items-center">
          <p>This website is powered by The Startup Template</p>
        </div>
      </div>
    </div>
  );
}
