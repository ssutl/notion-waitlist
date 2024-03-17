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
        <div className="cursor-pointer fixed top-10 right-10 z-10 w-10 h-10 md:w-14 md:h-14">
          <Image
            src="/Home.gif"
            alt="Home"
            onClick={() => router.push("/")}
            layout="fill"
            objectFit="cover"
            onClickCapture={() => router.push("/")}
          />
        </div>
      )}
      {children}
    </>
  );
};

export default Layout;
