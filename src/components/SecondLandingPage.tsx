import { useState, useEffect, RefObject } from "react";
import { ParallaxY } from "./Parallax/ParallaxY";
import { ParallaxFade } from "./Parallax/ParallaxFade";
import { ParallaxZoom } from "./Parallax/ParallaxZoom";
import { ParallaxX } from "./Parallax/ParallaxX";
import { HeroSectionOne } from "./HeroSection";
import { NavbarDemo } from "./ResizeableNavbar";
import { ParallaxSkew } from "./Parallax/ParallaxSkew";
import { StickyScrollRevealDemo } from "./StickyReveal";
import FuturisticFooter from "./footer";
import { ExpandingCardRow } from "./ui/ExpandingCard";


type SecondLandingPageProps = {
  scrollRef?: RefObject<HTMLDivElement>;
};

export default function SecondLandingPage({
  scrollRef,
}: SecondLandingPageProps) {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [typeof window !== "undefined" ? window.location.hash : ""]);

  useEffect(() => {
    if (scrollRef?.current) {
      const checkScrollable = () => {
        if (scrollRef.current!.scrollHeight > scrollRef.current!.clientHeight) {
          setReady(true);
        }
      };
      checkScrollable();
    }
  }, [scrollRef]);

  return (
    <section
      ref={scrollRef}
      className="min-h-[300vh] w-full relative text-white overflow-y-auto font-sans overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="fixed inset-0 z-[-10] bg-gradient-to-br from-black via-stone-600 to-black" />
      <div className="fixed inset-0 z-[-9] bg-[url('/Ai2.webp')] bg-fit lg:bg-cover lg:bg-no-repeat opacity-30 pointer-events-none" />
      {ready && (
        <>
          <NavbarDemo scrollRef={scrollRef} />
          <HeroSectionOne scrollRef={scrollRef} />

          <div className="flex flex-col gap-12 py-16 mx-auto">
          <ExpandingCardRow />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-10 max-w-5xl mx-auto">
              <ParallaxX
                speed={-1.3}
                scrollRef={scrollRef}
                className="relative rounded-xl shadow-xl backdrop-blur-md bg-opacity-40 flex flex-col items-center justify-center p-8 border border-white/20 
    bg-[url('/ai.png')] bg-cover"
              >
                <h2 className="mt-20 text-2xl sm:text-3xl font-semibold text-white mb-2">
                  Smart Job Matching
                </h2>
                <p className="text-gray-300 text-center max-w-xs text-sm sm:text-base">
                  AI analyzes job descriptions and customizes your resume to
                  improve alignment and visibility.
                </p>
              </ParallaxX>

              <ParallaxX
                speed={1.3}
                scrollRef={scrollRef}
                className="relative h-64 bg-[url('/ai3.webp')] bg-cover bg-center rounded-xl shadow-xl backdrop-blur-md bg-opacity-40 flex flex-col items-center justify-center p-8 border border-white/20"
              >
                <h2 className="mt-20 text-2xl sm:text-3xl font-semibold text-white mb-2">
                  Auto Formatting
                </h2>
                <p className="text-gray-300 text-center max-w-xs text-sm sm:text-base">
                  Professional layout generation — no design skills required,
                  just instant polish.
                </p>
              </ParallaxX>
            </div>
            <ParallaxY speed={-2} scrollRef={scrollRef} className="relative">
              <div className="flex w-[400px] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl max-w-4xl mx-auto text-center font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg -mb-20">
                AI: machines that simulate human intelligence.
              </div>
            </ParallaxY>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-10 max-w-5xl mx-auto">
              <ParallaxY
                speed={-2}
                scrollRef={scrollRef}
                className="relative h-64 bg-[url('/ai4.jpeg')] bg-cover bg-center rounded-xl shadow-xl backdrop-blur-md bg-opacity-40 flex flex-col items-center justify-center p-8 border border-white/20"
              >
                <h2 className=" mt-20 text-2xl sm:text-3xl font-semibold text-white mb-2">
                  Real-Time Feedback
                </h2>
                <p className="text-gray-300 text-center max-w-xs text-sm sm:text-base">
                  Get instant improvement tips on phrasing, clarity, and keyword
                  relevance.
                </p>
              </ParallaxY>

              <ParallaxY
                speed={-2}
                scrollRef={scrollRef}
                className="relative h-64 bg-[url('/ai5.jpg')] bg-cover bg-center rounded-xl shadow-xl backdrop-blur-md bg-opacity-40 flex flex-col items-center justify-center p-8 border border-white/20"
              >
                <h2 className="mt-20 text-2xl sm:text-3xl font-semibold text-white mb-2">
                  One-Click Export
                </h2>
                <p className="text-gray-300 text-center max-w-xs text-sm sm:text-base">
                  Export your finished resume to PDF or DOCX — ready for
                  applications.
                </p>
              </ParallaxY>
            </div>

            <ParallaxFade
              id="how-it-works"
              scrollRef={scrollRef}
              className="text-center relative rounded-xl shadow-2xl backdrop-blur-md bg-opacity-30 p-10 border border-white/20 -mt-40 mb-30"
            >
              <h2 className="text-3xl sm:text-7xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r tracking-tight  from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg mb-6">
                How It Works
              </h2>
              <ol className="text-gray-300 space-y-6 list-decimal list-inside text-base sm:text-lg">
                <li>Tell us about your job role and goals.</li>
                <li>Create or import your existing resume content.</li>
                <li>Let the AI optimize structure, keywords, and tone.</li>
                <li>Export and apply with confidence.</li>
              </ol>
            </ParallaxFade>

            <ParallaxZoom
              scrollRef={scrollRef}
              className="relative h-auto py-20 px-4 rounded-xl shadow-lg bg-transparent flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-bold text-center"
              scale={1.4}
              start="top bottom"
              end="center center"
            >
              <p className="max-w-3xl">
                Accelerate Your Job Search with AI-Driven Resume Optimization &
                Smart Job Matching
              </p>
            </ParallaxZoom>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-10 my-20 max-w-6xl px-4 mx-auto"
              id="features"
            >
              {[
                {
                  title: "AI-Powered Job Matching",
                  desc: "Get tailored job recommendations based on your resume and skills, powered by cutting-edge AI algorithms.",
                  icon: "/icons/ai_analytics.png",
                  skewX: 5,
                  skewY: -4,
                },
                {
                  title: "Instant Resume Formatting",
                  desc: "Automatically generate polished, ATS-friendly resumes in multiple formats — no design skills needed.",
                  icon: "/icons/auto_format.png",
                  skewX: 0,
                  skewY: 0,
                },
                {
                  title: "Real-Time Feedback & Export",
                  desc: "Receive AI-driven suggestions on clarity, keywords, and style, then export your resume with a single click.",
                  icon: "/icons/export_pdf.png",
                  skewX: -5,
                  skewY: 4,
                },
              ].map(({ title, desc, skewX, skewY }, i) => (
                <ParallaxSkew
                  key={i}
                  scrollRef={scrollRef}
                  className={`relative h-[50vh] rounded-xl shadow-xl backdrop-blur-md bg-opacity-50 flex flex-col items-center justify-center p-8 border border-white/20 bg-gradient-to-br from-black via-stone-700  to-black`}
                  skewX={skewX}
                  skewY={skewY}
                  start="top bottom"
                  end="center center"
                >
                  <h2 className="mt-30 text-center text-2xl sm:text-3xl font-semibold text-white mb-2">
                    {title}
                  </h2>
                  <p className="text-gray-300 text-center max-w-xs text-sm sm:text-base">
                    {desc}
                  </p>
                </ParallaxSkew>
              ))}
            </div>

            <StickyScrollRevealDemo />

            <FuturisticFooter />
          </div>
        </>
      )}
    </section>
  );
}
