"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxStaggerProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  staggerDelay?: number;
  yFrom?: number;
  opacityFrom?: number;
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxStagger: React.FC<ParallaxStaggerProps> = ({
  children,
  scrollRef,
  className = "",
  staggerDelay = 0.2,
  yFrom = 100,
  opacityFrom = 0,
  start = "top bottom",
  end = "bottom top",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scroller = scrollRef?.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      const anim = gsap.from(el.children, {
        y: yFrom,
        opacity: opacityFrom,
        stagger: staggerDelay,
        ease: "power1.out",
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
  }, [staggerDelay, yFrom, opacityFrom, scrollRef, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
