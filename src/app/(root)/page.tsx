"use client";

import { useEffect, useState } from "react";
import LampDemo from "@/components/ui/lamp";
import SecondLandingPage from "@/components/SecondLandingPage";
import { ParallaxWrapper } from "@/components/Parallax/ParallaxMotion";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = session?.user;


  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  return (
    <main>
      <ParallaxWrapper isLoggedIn={isLoggedIn}>
        <LampDemo />
        <SecondLandingPage />
      </ParallaxWrapper>
    </main>
  );
}
