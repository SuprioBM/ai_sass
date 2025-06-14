"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GlareCard } from "../ui/glarecard";

interface ParallaxSkewProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  skewX?: number;
  skewY?: number;
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxSkew: React.FC<ParallaxSkewProps> = ({
  children,
  scrollRef,
  className = "",
  skewX = 10,
  skewY = 0,
  start = "top center",
  end = "bottom top",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scroller = scrollRef?.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      const anim = gsap.to(el, {
        skewX,
        skewY,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scroller,
          start,
          end,
          scrub: true,
        },
      });

      return () => anim.scrollTrigger?.kill();
    }, ref);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [skewX, skewY, scrollRef, start, end]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      <GlareCard>
      {children}
      </GlareCard>
    </div>
  );
};
