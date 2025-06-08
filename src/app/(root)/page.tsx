"use client";

import { use, useEffect, useState } from "react";
import LampDemo from "@/components/ui/lamp";
import SecondLandingPage from "@/components/Parallax/SecondLandingPage";
import { ParallaxWrapper }from "@/components/Parallax/ParallaxMotion";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = session?.user


 useEffect(() => {
   if(user){
      setIsLoggedIn(true);    
   }
    else {
        setIsLoggedIn(false);
    }
  }
, [user]);

  return (
    <main
      className="min-h-screen
     bg-black text-white"
    >
      <ParallaxWrapper isLoggedIn={isLoggedIn}>
        <LampDemo />
        <SecondLandingPage />
      </ParallaxWrapper>
    </main>
  );
}
