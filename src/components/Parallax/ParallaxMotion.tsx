"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

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
  const [hasMounted, setHasMounted] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const leftOpacity = useTransform(progress, [0.95, 1], [1, 0]);
  const rightOpacity = useTransform(progress, [0.95, 1], [1, 0]);

  const leftX = useTransform(progress, [0, 1], ["0vw", "-50vw"]);
  const leftY = useTransform(progress, [0, 1], ["0vh", "-50vh"]);
  const rightX = useTransform(progress, [0, 1], ["0vw", "50vw"]);
  const rightY = useTransform(progress, [0, 1], ["0vh", "50vh"]);

  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), 50);
    const readyTimeout = setTimeout(() => setContentReady(true), 600); // Delay scroll content visibility
    return () => {
      clearTimeout(timeout);
      clearTimeout(readyTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    let startY = 0;
    let ticking = false;

    const updateProgress = (deltaY: number) => {
      scrollAccumulator.current = Math.min(
        1,
        Math.max(0, scrollAccumulator.current + deltaY * 0.01)
      );
      animate(progress, scrollAccumulator.current, { duration: 0.25, ease: "easeOut" });
      setIsFullyOpen(scrollAccumulator.current >= 0.99);
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      const scrollEl = scrollRef.current;
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      const atTop = scrollEl?.scrollTop === 0;

      if (
        (scrollAccumulator.current < 1 && isScrollingDown) ||
        (scrollAccumulator.current > 0 && isScrollingUp && atTop)
      ) {
        e.preventDefault();
        if (!ticking) {
          requestAnimationFrame(() => {
            updateProgress(deltaY);
            ticking = false;
          });
          ticking = true;
        }
      }

      startY = e.touches[0].clientY;
    };

    const onWheel = (e: WheelEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const scrollingUp = e.deltaY < 0;
      const atTop = scrollEl.scrollTop <= 0;
      const isFull = scrollAccumulator.current >= 0.99;

      if (scrollAccumulator.current < 1) {
        e.preventDefault();
        scrollAccumulator.current = Math.min(
          1,
          Math.max(0, scrollAccumulator.current + e.deltaY * 0.005)
        );
        animate(progress, scrollAccumulator.current, { duration: 0.25, ease: "easeOut" });
        setIsFullyOpen(scrollAccumulator.current >= 0.99);
        return;
      }

      if (isFull && scrollingUp && atTop) {
        e.preventDefault();
        scrollAccumulator.current = Math.max(
          0,
          scrollAccumulator.current - Math.abs(e.deltaY) * 0.005
        );
        animate(progress, scrollAccumulator.current, { duration: 0.25, ease: "easeOut" });
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
    document.body.style.overflow = isMobile || isFullyOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullyOpen]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-neutral-900"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Scrollable Content */}
      {contentReady && (
        <motion.div
          id="scroll-section"
          ref={scrollRef}
          className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            height: "100vh",
            pointerEvents: isFullyOpen ? "auto" : "none",
            touchAction: isFullyOpen ? "auto" : "none",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {React.cloneElement(children[1], {
            scrollRef: scrollRef,
          })}
        </motion.div>
      )}

      {/* Left Triangle */}
      {hasMounted && (
        <>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="fixed top-0 bottom-0 left-0 w-screen h-screen z-10"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              x: leftX,
              y: leftY,
              willChange: "transform",
              opacity: leftOpacity,
              pointerEvents: isFullyOpen ? "none" : "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex items-center justify-center">{children[0]}</div>
          </motion.div>

          {/* Right Triangle */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="fixed top-0 bottom-0 right-0 w-screen h-screen z-10"
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              x: rightX,
              y: rightY,
              willChange: "transform",
              opacity: rightOpacity,
              pointerEvents: isFullyOpen ? "none" : "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="overflow-hidden w-full h-full flex items-center justify-center">
              {children[0]}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
          
