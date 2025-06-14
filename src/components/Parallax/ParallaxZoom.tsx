"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxZoomProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  scale?: number;
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxZoom: React.FC<ParallaxZoomProps> = ({
  children,
  scrollRef,
  className = "",
  scale = 1.2,
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
        scale,
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
  }, [scale, scrollRef, start, end]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
