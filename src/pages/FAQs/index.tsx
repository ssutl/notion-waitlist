import { useState } from "react";
import React, { useRef } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CMS_NOTION_PAGE, FAQ_NOTION_PAGE } from "../../../@types/types";
import retrieveFAQEntries from "@/Functions/getFAQs";
import createFAQEntry from "@/Functions/addFAQ";
import getHomePageDetails from "@/Functions/getHome";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps<{
  FAQContent: FAQ_NOTION_PAGE[];
  dashboardContent: CMS_NOTION_PAGE;
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const FAQContentResponse = await retrieveFAQEntries();
  const dashboardContentResponse = await getHomePageDetails();

  return {
    props: {
      FAQContent: FAQContentResponse,
      dashboardContent: dashboardContentResponse,
    },
  };
};

export default function FAQ({
  FAQContent,
  dashboardContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const questionRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [QuestionSuccess, setQuestionSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (emailRef.current?.value && questionRef.current?.value) {
      createFAQEntry({
        email: emailRef.current.value,
        question: questionRef.current.value,
      });
      setQuestionSuccess(true);
      setTimeout(() => {
        setQuestionSuccess(false);
      }, 1000);
    }

    (event.target as HTMLFormElement).reset();
  };

  return (
    <>
      <Head>
        <title>
          {dashboardContent.properties["Product name"].rich_text[0].plain_text}
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
      <div className="w-full flex flex-col py-14 px-10 lg:px-12">
        {FAQContent.length > 0 ? (
          <>
            <h1 className="text-4xl mt-10 mb-5 font-semibold md:text-5xl">
              Got Questions?
            </h1>
            <h1 className="text-4xl font-semibold mb-10 md:text-5xl">
              We have answers.
            </h1>
            <form>
              <input
                type={"text"}
                placeholder={"Search the FAQ"}
                required
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 outline outline-1  outline-slate-400 rounded-md mb-10 p-2.5 text-base md:text-2xl"
              />
            </form>
            {FAQContent.filter((eachFAQ, key) => {
              return eachFAQ.properties["Question"].title[0].plain_text
                .toLowerCase()
                .startsWith(searchTerm.toLowerCase());
            }).map((FAQ: any, key: number) => (
              <div key={key}>
                <div
                  key={key}
                  className="w-full flex justify-between border-b-2 mb-5 pb-4 border-solid border-black flex-row items-center "
                >
                  <h1 className="text-xl font-semibold max-w-60 md:text-3xl md:max-w-xl">
                    {FAQ.properties["Question"].title[0].plain_text}
                  </h1>
                  <button
                    className="text-3xl md:text-4xl"
                    onClick={() =>
                      setExpandedQuestionIndex(
                        key === expandedQuestionIndex ? null : key
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <p
                  className={`${
                    expandedQuestionIndex === key
                      ? "pb-5 border-b-2 border-solid border-gray-700"
                      : "h-0"
                  }  mb-5 text-base transition-max-height duration-500 ease-in-out overflow-hidden md:text-2xl`}
                >
                  {expandedQuestionIndex === key
                    ? FAQ.properties["Response"].rich_text[0].plain_text
                    : null}
                </p>
              </div>
            ))}
          </>
        ) : null}
        <h1 className="text-4xl mt-10 mb-5 font-semibold md:mt-5 md:mb-7 md:text-5xl">
          Want to ask something?
        </h1>
        <h1 className="text-base mb-10 font-semibold md:text-5xl">
          Leave a question and your email and we will get back to you!
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type={"text"}
            placeholder={"Ask a question"}
            required
            ref={questionRef}
            className="w-full h-14 outline outline-1  outline-slate-400 rounded-md mb-3 p-2.5 text-base md:text-2xl md:mb-5"
          />
          <input
            type={"email"}
            placeholder={"Enter your email"}
            required
            ref={emailRef}
            className="w-full h-14 outline outline-1  outline-slate-400 rounded-md mb-3 p-2.5 text-base md:text-2xl md:mb-5"
          />
          <button
            type="submit"
            className={`w-full h-14 bg-black text-white rounded-md font-semibold text-base md:text-2xl ${
              QuestionSuccess ? "bg-green-300" : "hover:bg-gray-500"
            } `}
          >
            {QuestionSuccess ? "Asked!" : "Ask question"}
          </button>
        </form>
      </div>
    </>
  );
}
