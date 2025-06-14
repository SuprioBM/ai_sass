"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxColorShiftProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  filterFrom?: string; // e.g., "grayscale(0%)"
  filterTo?: string; // e.g., "grayscale(100%)"
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxColorShift: React.FC<ParallaxColorShiftProps> = ({
  children,
  scrollRef,
  className = "",
  filterFrom = "grayscale(0%)",
  filterTo = "grayscale(100%)",
  start = "top center",
  end = "bottom top",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scroller = scrollRef?.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        el,
        { filter: filterFrom },
        {
          filter: filterTo,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            scroller,
            start,
            end,
            scrub: true,
          },
        }
      );

      return () => anim.scrollTrigger?.kill();
    }, ref);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [filterFrom, filterTo, scrollRef, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
