"use client";

import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { ParallaxBackground } from "./Parallax/ParallaxBackground";

export function HeroSectionOne() {
     const { data: session } = useSession();
     const user = session?.user;


  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center mt-20">
      <Navbar user={user} />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"AI-Powered Resume Builder for Job Seekers"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Build modern, tailored resumes with smart formatting and real-time AI
          feedback. Increase your job chances with optimized keyword targeting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Build My Resume
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
           <ParallaxBackground
                         className="relative w-full max-w-[95%] sm:max-w-4xl lg:max-w-[1400px] h-[500px] mx-auto rounded-xl shadow-lg flex flex-col items-center justify-center text-white bg-[url('/Ai2.webp')] bg-cover bg-center border border-white/30 mb-20"
                         backgroundSpeed={0.2}
                       >
                         <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg">
                           AI-Powered CV & Resume Builder
                         </h1>
                         <p className="mt-4 max-w-2xl text-center text-gray-300 text-sm sm:text-lg">
                           Create tailored, standout resumes in minutes — optimized by AI
                           for your dream job.
                         </p>
                       </ParallaxBackground>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

type NavbarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    [key: string]: any;
  } | null;
};

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex w-full items-center justify-center border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
        <h1 className="text-base font-bold md:text-2xl">
          Hi, {user?.name ?? "Guest"}
        </h1>
        <span className="size-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></span>
      </div>
    </nav>
  );
};
