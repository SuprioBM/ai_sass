"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxYProps {
  children: React.ReactNode;
  speed?: number; // Positive = scrolls slower; Negative = scrolls opposite
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

gsap.registerPlugin(ScrollTrigger);

const registeredScrollers = new WeakSet<Element>();

export const ParallaxY: React.FC<ParallaxYProps> = ({
  children,
  speed = -0.3,
  className = "",
  scrollRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scrollContainer = scrollRef?.current;

    if (!el || !scrollContainer) return;

    if (!registeredScrollers.has(scrollContainer)) {
      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          if (arguments.length) scrollContainer.scrollTop = value!;
          return scrollContainer.scrollTop;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: scrollContainer.clientWidth,
            height: scrollContainer.clientHeight,
          };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.defaults({ scroller: scrollContainer });
      registeredScrollers.add(scrollContainer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.to(el, {
        yPercent: speed * 100, // scaled down for subtle movement
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scroller: scrollContainer,
          start: "top bottom", // starts when element enters viewport
          end: "+=400", // ends when it leaves
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => tl.scrollTrigger?.kill();
    }, ref);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [speed, scrollRef]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
