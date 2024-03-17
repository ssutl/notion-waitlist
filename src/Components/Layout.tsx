import React from "react";
import { useRouter } from "next/router";
import { ImageError } from "next/dist/server/image-optimizer";

import Image from "next/image"; // Import the Image component from the correct package

const Layout = ({ children }: any) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/" && (
        // Display Home.gif
        <Image
          src="/Home.gif"
          alt="Home"
          className="cursor-pointer fixed top-10 right-10 z-10"
          onClick={() => router.push("/")}
          width={30}
          height={30}
          onClickCapture={() => router.push("/")}
        />
      )}
      {children}
      <div className="w-full h-20 flex justify-center px-10 items-center">
        <p>This website is powered by The Startup Template</p>
      </div>
    </>
  );
};

export default Layout;
