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
  const [hasMounted, setHasMounted] = useState(false); // Fix flickering

  const scrollRef = useRef<HTMLDivElement>(null);

  const leftX = useTransform(progress, [0, 1], ["0vw", "-50vw"]);
  const leftY = useTransform(progress, [0, 1], ["0vh", "-50vh"]);
  const rightX = useTransform(progress, [0, 1], ["0vw", "50vw"]);
  const rightY = useTransform(progress, [0, 1], ["0vh", "50vh"]);

  useEffect(() => {
    setHasMounted(true); // Wait for mount before render
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
      progress.set(parseFloat(scrollAccumulator.current.toFixed(3))); // Smoothness fix
      setIsFullyOpen(scrollAccumulator.current === 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      const scrollEl = scrollRef.current;
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      const atTop = (scrollEl?.scrollTop || 0) <= 2; // Threshold for smoother reverse scroll

      if (
        (scrollAccumulator.current < 1 && isScrollingDown) ||
        (scrollAccumulator.current === 1 && isScrollingUp && atTop)
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
      const atTop = scrollEl.scrollTop <= 2;

      if (scrollAccumulator.current < 1) {
        e.preventDefault();
        scrollAccumulator.current = Math.min(
          1,
          Math.max(0, scrollAccumulator.current + e.deltaY * 0.002)
        );
        progress.set(parseFloat(scrollAccumulator.current.toFixed(3)));
        setIsFullyOpen(scrollAccumulator.current === 1);
        return;
      }

      if (scrollAccumulator.current === 1 && scrollingUp && atTop) {
        e.preventDefault();
        scrollAccumulator.current = Math.max(
          0,
          scrollAccumulator.current - Math.abs(e.deltaY) * 0.002
        );
        progress.set(parseFloat(scrollAccumulator.current.toFixed(3)));
        setIsFullyOpen(false);
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
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = isFullyOpen ? "auto" : "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullyOpen]);

  if (!hasMounted) return null;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-white"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Scrollable section */}
      <div
        id="scroll-section"
        ref={scrollRef}
        className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          height: "100vh",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {React.cloneElement(children[1], {
          scrollRef: scrollRef,
        })}
      </div>

      {/* Top-left triangle */}
      <motion.div
        initial={{ x: 0, y: 0 }}
        className="absolute top-0 bottom-0 left-0 w-screen h-screen z-10"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          x: leftX,
          y: leftY,
          willChange: "transform",
          opacity: isFullyOpen ? 0 : 1,
          pointerEvents: isFullyOpen ? "none" : "auto",
        }}
      >
        <div className="flex items-center justify-center">{children[0]}</div>
      </motion.div>

      {/* Bottom-right triangle */}
      <motion.div
        initial={{ x: 0, y: 0 }}
        className="fixed top-0 bottom-0 right-0 w-screen h-screen z-10"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          x: rightX,
          y: rightY,
          willChange: "transform",
          opacity: isFullyOpen ? 0 : 1,
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
