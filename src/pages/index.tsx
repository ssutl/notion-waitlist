import React, { useRef, useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CMS_NOTION_PAGE } from "../../@types/types";
import getHomePageDetails from "@/Functions/getHome";
import createWaitlistEntry from "@/Functions/addWaitlist";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import CountdownComponent from "@/Components/CountdownComponent";

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
  const [hasSignedUp, setHasSignedUp] = useState(false);

  useEffect(() => {
    const signedUp = sessionStorage.getItem("userSignedUp") === "true";
    setHasSignedUp(signedUp);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    if (email) {
      try {
        await createWaitlistEntry({ email });
        setHasSignedUp(true);
        sessionStorage.setItem("userSignedUp", "true");
        (event.target as HTMLFormElement).reset();
      } catch (error) {
        console.error("Signup failed", error);
      }
    }
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
      <div className="w-screen flex flex-col overflow-y-scroll lg:flex-row lg:h-screen lg:overflow-y-hidden">
        <div className="w-full h-96 flex items-center bg-black relative lg:w-1/2 lg:h-full">
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
        <div className="w-full py-10 px-10 flex flex-col items-start overflow-x-hidden lg:h-full lg:w-1/2 lg:overflow-y-scroll lg:px-12">
          <h1 className="text-4xl font-semibold mb-10 md:text-5xl md:mb-8">
            {dashboardContent.properties["Main text"].rich_text[0]
              ? dashboardContent.properties["Main text"].rich_text[0].plain_text
              : "Welcome to the dashboard, change the Main Text property in Notion to see the changes here!"}
          </h1>
          <div className="mb-10">
            {renderWithLineBreaks(
              dashboardContent.properties["Description"].rich_text[0]
                ? dashboardContent.properties["Description"].rich_text[0]
                    .plain_text
                : "This is the description, change the Description property in Notion to see the changes here!"
            )}
          </div>
          {dashboardContent.properties["Release date"].date &&
          new Date(dashboardContent.properties["Release date"].date.start) >
            new Date() &&
          dashboardContent.properties["Released product website"].url ===
            null ? (
            <CountdownComponent
              date={dashboardContent.properties["Release date"].date.start}
            />
          ) : null}
          {dashboardContent.properties["Released product website"].url && (
            <a
              href={dashboardContent.properties["Released product website"].url}
              target="_blank"
              rel="noreferrer"
              className="mb-10 text-xl md:text-2xl cursor-pointer underline underline-offset-8"
            >
              Visit the product drop ↗
            </a>
          )}
          {dashboardContent.properties["Released product website"].url ===
          null ? (
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type={"email"}
                placeholder={"Johndoe@example.com"}
                ref={emailRef}
                required
                className="w-full h-14 outline outline-1  outline-slate-400 text-base rounded-md mb-3 p-2.5 md:mb-5 md:text-2xl lg:w-1/2 lg:mb-7 lg:px-5"
              />
              <button
                type="submit"
                disabled={hasSignedUp}
                className={`w-full h-14 ${
                  hasSignedUp ? "bg-green-300" : "bg-black hover:bg-gray-500"
                } text-white rounded-md font-semibold text-base mb-8 md:mb-5 md:text-2xl lg:w-fit lg:px-5 lg:ml-7`}
              >
                {hasSignedUp ? "Joined!" : "Join the waitlist"}
              </button>
            </form>
          ) : null}
          <div className="w-full flex justify-start items-center relative mb-12">
            {dashboardContent.properties.Instagram.url && (
              <a
                href={dashboardContent.properties.Instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/Socials/Instagram.png"
                  alt="Instagram logo"
                  width={50}
                  height={50}
                  className="mr-4 w-9"
                />
              </a>
            )}
            {dashboardContent.properties.Youtube.url && (
              <a
                href={dashboardContent.properties.Youtube.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/Socials/Youtube.png"
                  alt="Youtube logo"
                  width={50}
                  height={50}
                  className="mr-4 w-9"
                />
              </a>
            )}
            {dashboardContent.properties.X.url && (
              <a
                href={dashboardContent.properties.X.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/Socials/X.png"
                  alt="X logo"
                  width={50}
                  height={50}
                  className="mr-4 w-9"
                />
              </a>
            )}
          </div>

          <h1 className="text-2xl font-semibold mb-4 text-left md:text-3xl">
            Not convinced?
          </h1>
          <p className="mb-4 text-base md:text-2xl">
            There&apos;s way more to be excited about, checkout our features
            page to see more!
          </p>
          <h1
            onClick={() => router.push("/Features")}
            className="mb-10 text-xl md:text-2xl cursor-pointer underline underline-offset-8"
          >
            Read Features ↗
          </h1>
          <h1 className="text-2xl font-semibold mb-4 text-left md:text-3xl">
            Still got questions?
          </h1>
          <p className="mb-4 text-base md:text-2xl">
            Got any questions or suggestions, head to the FAQ page and
            we&apos;ll get back to you!
          </p>
          <h1
            onClick={() => router.push("/FAQs")}
            className="text-xl md:text-2xl cursor-pointer underline underline-offset-8"
          >
            Read FAQ ↗
          </h1>
          <div className="w-full flex justify-center items-center mt-16">
            <p className="text-base md:text-xl">
              This website is powered by SSPLATE
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
