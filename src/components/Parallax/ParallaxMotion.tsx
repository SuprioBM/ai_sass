"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface ParallaxWrapperProps {
  children: [
    React.ReactNode,
    React.ReactElement<{ scrollRef?: React.RefObject<HTMLDivElement | null> }>
  ];
  isLoggedIn: boolean;
}

export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({
  children,
  isLoggedIn,
}) => {
  const progress = useMotionValue(0);
  const scrollAccumulator = useRef(0);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Motion transforms for the two triangles
  const leftX = useTransform(progress, [0, 1], ["0vw", "-50vw"]);
  const leftY = useTransform(progress, [0, 1], ["0vh", "-50vh"]);
  const rightX = useTransform(progress, [0, 1], ["0vw", "50vw"]);
  const rightY = useTransform(progress, [0, 1], ["0vh", "50vh"]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;

      if (scrollAccumulator.current < 1) {
        e.preventDefault();
        scrollAccumulator.current = Math.min(
          1,
          Math.max(0, scrollAccumulator.current + deltaY * 0.01)
        );
        progress.set(scrollAccumulator.current);
        setIsFullyOpen(scrollAccumulator.current === 1);
      }

      if (scrollAccumulator.current === 1 && deltaY < 0) {
        // Swiping down to close
        e.preventDefault();
        scrollAccumulator.current = Math.max(
          0,
          scrollAccumulator.current + deltaY * 0.01
        );
        progress.set(scrollAccumulator.current);
        setIsFullyOpen(false);
      }

      startY = e.touches[0].clientY; // update for next move
    };

    const onWheel = (e: WheelEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const scrollingUp = e.deltaY < 0;
      const atTop = scrollEl.scrollTop <= 0;

      if (scrollAccumulator.current < 1) {
        e.preventDefault();
        scrollAccumulator.current = Math.min(
          1,
          Math.max(0, scrollAccumulator.current + e.deltaY * 0.002)
        );
        progress.set(scrollAccumulator.current);
        setIsFullyOpen(scrollAccumulator.current === 1);
        return;
      }

      if (scrollAccumulator.current === 1 && scrollingUp && atTop) {
        e.preventDefault();
        scrollAccumulator.current = Math.max(
          0,
          scrollAccumulator.current - Math.abs(e.deltaY) * 0.002
        );
        progress.set(scrollAccumulator.current);
        setIsFullyOpen(false);
        return;
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    } else {
      window.addEventListener("wheel", onWheel, { passive: false });
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      } else {
        window.removeEventListener("wheel", onWheel);
      }
    };
  }, [progress, isLoggedIn]);
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
      // On mobile, always allow scrolling
      document.body.style.overflow = "auto";
    } else {
      // On desktop, toggle based on isFullyOpen
      document.body.style.overflow = isFullyOpen ? "auto" : "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullyOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Scrollable section (revealed after parallax opens) */}
      <div
        id="scroll-section"
        ref={scrollRef}
        className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: "100vh" }} // ensure full viewport height for scroll
      >
        {React.cloneElement(children[1], {
          scrollRef: scrollRef, // pass the whole ref object
        })}
      </div>

      {/* Top-left triangle */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-screen h-screen z-10"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          x: leftX,
          y: leftY,
          display: isFullyOpen ? "none" : "block",
          pointerEvents: isFullyOpen ? "none" : "auto",
        }}
      >
        <div className="flex items-center justify-center">{children[0]}</div>
      </motion.div>

      {/* Bottom-right triangle */}
      <motion.div
        className="fixed top-0 bottom-0 right-0 w-screen h-screen z-10"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          x: rightX,
          y: rightY,
          display: isFullyOpen ? "none" : "block",
          pointerEvents: isFullyOpen ? "none" : "auto",
        }}
      >
        <div className="overflow-hidden w-full h-full flex items-center justify-center">
          {children[0]}
        </div>
      </motion.div>
    </div>
  );
};
