"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { NavbarDemo } from "@/components/ResizeableNavbar";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBackgroundScroll() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    gsap.to(bgRef.current, {
      y: "-20%", // moves background up as you scroll
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <>
    <NavbarDemo/>

    <div className="relative h-[200vh] overflow-hidden">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/Ai_blog.png')" }}
      />
      <div className="relative z-10 h-full flex items-center justify-center text-white text-4xl font-bold bg-black/40">
        Scroll to see background move
      </div>
    </div>
    </>
  );
}
