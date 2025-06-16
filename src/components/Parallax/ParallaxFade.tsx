"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxFadeProps {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  id?: string;
  fromOpacity?: number;
  toOpacity?: number;
  start?: string;
  end?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxFade: React.FC<ParallaxFadeProps> = ({
  children,
  scrollRef,
  className = "",
  fromOpacity = 1,
  toOpacity = 0,
  start = "top center",
  end = "bottom top",
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scroller = scrollRef?.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        el,
        { opacity: fromOpacity },
        {
          opacity: toOpacity,
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
  }, [fromOpacity, toOpacity, scrollRef, start, end]);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
};
