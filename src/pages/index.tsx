import React, { useRef } from "react";
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(emailRef.current?.value); // Logs the value of the input field
    if (emailRef.current?.value)
      createWaitlistEntry({ email: emailRef.current.value });
  };

  return (
    <div className="w-screen flex flex-col overflow-y-scroll">
      <div className="w-full h-80 flex justify-center items-center relative bg-black">
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
      <div className="w-full py-14 px-10 flex justify-center items-center flex-col">
        <h1 className="text-4xl font-semibold mb-10">
          {dashboardContent.properties["Main text"].rich_text[0].plain_text}
        </h1>
        <p className="text-base mb-10">
          {dashboardContent.properties["Description"].rich_text[0].plain_text}
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
            className="w-full h-14 bg-black text-white rounded-md font-semibold"
          >
            Join the waitlist
          </button>
        </form>
      </div>
    </div>
  );
}
