// ParallaxCombo.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxComboProps {
  scrollRef?: React.RefObject<HTMLDivElement>;
  background: React.ReactNode;
  foregroundX: React.ReactNode;
  foregroundY: React.ReactNode;
  className?: string;
}

gsap.registerPlugin(ScrollTrigger);

export const ParallaxCombo: React.FC<ParallaxComboProps> = ({
  scrollRef,
  background,
  foregroundX,
  foregroundY,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef?.current;
    const container = containerRef.current;
    const xEl = xRef.current;
    const yEl = yRef.current;

    if (!scrollContainer || !container || !xEl || !yEl) return;

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller: scrollContainer,
        start: "top center",
        end: "+=200%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
      },
    });

    tl.to(
      xEl,
      { xPercent: -100, opacity: 0, duration: 1, ease: "power2.out" },
      0
    ).fromTo(
      yEl,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      0.5
    );

    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      tl.kill();
      clearTimeout(refreshId);
    };
  }, [scrollRef]);

  return (
    <div ref={containerRef} className={`relative w-full h-screen ${className}`}>
      <div ref={bgRef} className="absolute inset-0 z-0">
        {background}
      </div>
      <div ref={xRef} className="relative z-10">
        {foregroundX}
      </div>
      <div ref={yRef} className="relative z-10 mt-[-200px]">
        {foregroundY}
      </div>
    </div>
  );
};
