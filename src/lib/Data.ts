// @ts-nocheck
import MinimalisticTemplate from "@/components/CvTemplates/BlueTemplate";
import { ClassicTemplate } from "@/components/CvTemplates/ClassicTemplate";
import { CreativeTemplate } from "@/components/CvTemplates/CreativeTemplate";
import ModernTemplate from "@/components/CvTemplates/ModernTemplate";
import StylishTemplate from "@/components/CvTemplates/StylishTemplate";

export const dummyData = {
  name: "Suprio Dev",
  email: "suprio@example.com",
  phone: "+880123456789",
  location: "Dhaka, Bangladesh",
  linkedin: "https://linkedin.com/in/supriodev",
  github: "https://github.com/supriodev",
  portfolio: "https://supriodev.com",
  summary:
    "Passionate developer with a focus on elegant solutions, clean code, and scalable architecture.",

  experience: [
    {
      role: "Full Stack Developer",
      company: "ABC Tech",
      startDate: "Jan 2021",
      endDate: "Present",
      description:
        "Developed full-stack web applications using React, Node.js, and MongoDB.",
    },
    {
      role: "Intern Developer",
      company: "XYZ Solutions",
      startDate: "Jun 2020",
      endDate: "Dec 2020",
      description: "Built internal tools using Vue and Firebase.",
    },
  ],

  education: [
    {
      degree: "BSc in Computer Science & Engineering",
      school: "XYZ University",
      startDate: "2016",
      endDate: "2020",
    },
  ],

  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Next.js",
    "MongoDB",
    "TypeScript",
  ],

  projects: [
    {
      name: "Portfolio Website",
      description:
        "Personal portfolio showcasing my work using Next.js and Tailwind CSS.",
    },
    {
      name: "Chat App",
      description:
        "Real-time chat application built with Socket.io and Express.",
    },
  ],

  certificates: [
    {
      name: "Full Stack Web Development",
      issuer: "Coursera",
    },
    {
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
    },
  ],

  languages: ["English", "Bengali", "Hindi"],
  
};


export const templates = {
  ModernTemplate,
  StylishTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalisticTemplate,
};