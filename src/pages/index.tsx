import React, { useRef, useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CMS_NOTION_PAGE } from "../../@types/types";
import getHomePageDetails from "@/Functions/getHome";
import createWaitlistEntry from "@/Functions/addWaitlist";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import CountdownComponent from "@/Components/CountdownComponent";
import getPricingDetails from "@/Functions/getPricing";
import ReactMarkdown from "react-markdown";
//Clean repo

export const getServerSideProps: GetServerSideProps<{
  dashboardContent: CMS_NOTION_PAGE;
  pricingContent: string;
}> = async (context) => {
  //Make a req to the api directory /api/Home.ts
  const dashboardContentResponse = await getHomePageDetails();
  const pricingContentResponse = await getPricingDetails();

  return {
    props: {
      dashboardContent: dashboardContentResponse,
      pricingContent: pricingContentResponse,
    },
  };
};

function parseCallouts(markdown: string): {
  title: string;
  doneItems: string[];
  notDoneItems: string[];
}[] {
  const callouts: {
    title: string;
    doneItems: string[];
    notDoneItems: string[];
  }[] = [];

  const lines = markdown.split("\n");

  let currentCallout: {
    title: string;
    doneItems: string[];
    notDoneItems: string[];
  } | null = null;

  lines.forEach((line) => {
    if (line.startsWith(">")) {
      const cleanLine = line.substring(1).trim(); // Remove '>' and trim whitespace
      if (currentCallout === null) {
        // It's the start of a new callout
        currentCallout = { title: cleanLine, doneItems: [], notDoneItems: [] };
      } else {
        // It's a part of the current callout
        const notDoneItemMatch = cleanLine.match(/- \[ \] (.+)/);
        const doneItemMatch = cleanLine.match(/- \[x\] (.+)/);

        if (notDoneItemMatch) {
          currentCallout.notDoneItems.push(notDoneItemMatch[1]);
        } else if (doneItemMatch) {
          currentCallout.doneItems.push(doneItemMatch[1]);
        }
      }
    } else if (currentCallout !== null) {
      // No longer a callout line, so save the current callout and reset
      callouts.push(currentCallout);
      currentCallout = null; // Reset for the next callout
    }
    // Ignore non-callout lines that are not immediately following a callout
  });

  // Check if there's an unclosed callout at the end
  if (currentCallout !== null) {
    callouts.push(currentCallout);
  }

  return callouts;
}

export default function Home({
  dashboardContent,
  pricingContent,
}: // ...
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const callouts = parseCallouts(pricingContent);
  console.log(pricingContent);

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
            className="text-xl md:text-2xl cursor-pointer underline underline-offset-8 mb-10"
          >
            Read FAQ ↗
          </h1>
          {callouts.length > 0 ? (
            <>
              <h1 className="text-2xl font-semibold mb-6 text-left md:text-3xl">
                Pricing?
              </h1>
              <div className="w-full flex flex-col items-center 2xl:grid 2xl:grid-cols-auto 2xl:grid-flow-col 2xl:gap-x-7 2xl:items-start">
                {callouts.slice(0, 3).map((eachCallout, i) => (
                  <div
                    key={i}
                    className="border border-black rounded-md py-5 px-5 box-border w-full mb-5 2xl:px-5 2xl:mt-0 cursor-pointer hover:bg-sky-100 2xl:h-full"
                  >
                    <h2 className="text-2xl font-semibold mb-4 text-left md:text-3xl">
                      {eachCallout.title}
                    </h2>
                    {eachCallout.doneItems.map((item, j) => (
                      <div className="w-full flex mb-3 2xl:mb-0" key={j}>
                        <input
                          type="checkbox"
                          checked={true}
                          disabled={true}
                          className="mr-3 h-4 w-4 mt-auto mb-auto"
                        />
                        <p className="text-base md:text-2xl line-through">
                          {item}
                        </p>
                      </div>
                    ))}
                    {eachCallout.notDoneItems.map((item, j) => (
                      <div className="w-full flex mb-3" key={j}>
                        <input
                          type="checkbox"
                          checked={false}
                          disabled={true}
                          className="mr-3 h-4 w-4 mt-auto mb-auto"
                        />
                        <p className="text-base md:text-2xl">{item}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : null}
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
