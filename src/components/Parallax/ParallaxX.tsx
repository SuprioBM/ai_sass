"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ParallaxXProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

gsap.registerPlugin(ScrollTrigger);

const disableScroll = () => {
  document.body.style.overflow = "hidden";
};

const enableScroll = () => {
  document.body.style.overflow = "";
};

export const ParallaxX: React.FC<ParallaxXProps> = ({
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

    const ctx = gsap.context(() => {
      const tl = gsap.to(el, {
        x: speed * 400,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 30%",
          end: "+=250",
          scrub: true,
          pin: true,
          scroller: scrollContainer,
          anticipatePin: 1,
          onEnter: disableScroll,
          onLeave: enableScroll,
          onEnterBack: disableScroll,
          onLeaveBack: enableScroll,
        },
      });

      return () => {
        tl.scrollTrigger?.kill();
      };
    }, ref);

    setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      ctx.revert();
      enableScroll();
    };
  }, [speed, scrollRef]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
