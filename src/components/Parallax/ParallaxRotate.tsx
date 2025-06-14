"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxRotateProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  rotation?: number; // degrees to rotate (e.g., 360)
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxRotate: React.FC<ParallaxRotateProps> = ({
  children,
  scrollRef,
  className = "",
  rotation = 360,
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
        rotation,
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
  }, [rotation, scrollRef, start, end]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
