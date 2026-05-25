import { image } from "framer-motion/client";
import { icons } from "lucide-react";

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface Project {
  name: string;
  description: string;
  metrics: string;
  imageUrl: string;
  githubUrl: string;
  techStack: string[];
}

export interface Activity {
  name: string;
  imageUrl: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Web Development",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML & CSS", "Responsive Design", "UI/UX"]
  },
  {
    title: "Backend & Database",
    skills: ["Node.js", "Express.js", "FastAPI", "RESTful APIs", "Python", "Prisma ORM", "MySQL", "SQLite", "Firebase", "SQL"]
  },
  {
    title: "IoT & Embedded",
    skills: ["IoT", "ESP32", "Arduino", "Embedded Systems", "MQTT", "Socket Programming", "Node-RED", "Elektronika", "C++"]
  },
  {
    title: "Core Engineering",
    skills: ["Data Structures", "Algorithms", "Object-Oriented Programming (OOP)", "Git", "Docker", "Java", "Kotlin", "Android Development", "Problem Solving"]
  }
];

export const socials: Social[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/hanifardiyantanugraha",
    icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M19 0h-14c-2.7 0-5 2.3-5 5v14c0 2.7 2.3 5 5 5h14c2.7 0 5-2.3 5-5v-14c0-2.7-2.3-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-1 0-1.75-.82-1.75-1.75s.75-1.75 1.75-1.75 1.75.82 1.75 1.75-.75 1.75-1.75 1.75zm13.5 11.25h-3v-5.6c0-1.3-.03-2.9-1.77-2.9-1.8 0-2.07 1.4-2.07 2.82v5.68h-3v-10h2.9v1.4h.04c.4-.76 1.38-1.57 2.83-1.57 3 0 3.55 1.98 3.55 4.56v5.6z"/></svg>`
  },
  {
    name: "GitHub",
    url: "https://github.com/hanifnugrahaa",
    icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 2.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>`
  },
  {
    name: "Instagram",
    url:"https://www.instagram.com/haniffnugraha/",
    icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
  <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.55 4 20 5.45 20 7.75v8.5C20 18.55 18.55 20 16.25 20h-8.5C5.45 20 4 18.55 4 16.25v-8.5C4 5.45 5.45 4 7.75 4zm8.75 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
</svg>`
  }
];

export const projects: Project[] = [
  {
    name: "G-Connect 2025 Weather Station Dashboard",
    description: "Led software development for IoT-based weather station system using ESP32 and solar power, designing full-stack architecture (frontend, backend, database) with features including real-time monitoring, historical data, alerts, and admin dashboard.",
    metrics: "ESP32•IoT device|Fullstack•architecture|Real-time•monitoring", 
    imageUrl: "/assets/images/PkM-Lab-SKJ.png",
    githubUrl: "https://pkmlab.my.id",
    techStack: ["Next.js", "FastAPI", "RESTful APIs", "WebSockets",  "SQLite", "Docker", "Tailwind"]
  },
  {
    name: "ERC UGM Organization Web",
    description: "Developed and optimized key features of organization website, improving engagement by 90% through SEO enhancements and interactive project showcases.",
    metrics: "50+•projects showcased|20+•external clients|85%•engagement boost", 
    imageUrl: "/assets/images/web-erc.png",
    githubUrl: "https://erc.elins.id/",
    techStack: ["Wordpress", "Elementor"]
  },
  {
    name: "4-DOF Robotic Arm Control System",
    description: "Implemented inverse kinematics for a 4-DOF robotic arm, enabling precise position control and coordinated motion of multiple joints.",
    metrics: "4-DOF•IK solver|<100ms•latency|Stable•motion control", 
    imageUrl: "/assets/videos/arm robot.mp4",
    githubUrl: "https://github.com/hanifnugrahaa/Arduino-Robot-Arm-Controller",
    techStack: ["Arduino", "Servo", "C++"]
  },
  {
    name: "GamaSense Air Quality Platform",
    description: "Developed real-time indoor air quality monitoring system for health awareness, visualizing environmental data through a web dashboard for actionable insights.",
    metrics: "5+•air parameters|Real-time•alerts|Health-focused•insights",
    imageUrl: "/assets/images/gamasense.png",
    githubUrl: "https://gamasense.vercel.app",
    techStack: ["React.js + Vite", "Node-RED", "WebSockets", "MQTT", "SQLite", "Vercel", "Railway", "Three.js"]
  },
  {
    name: "ERC Inventory and Rent System",
    description: "Developed web-based asset management and rental platform with admin dashboard and authentication system, enabling efficient equipment management and streamlined booking with WhatsApp-based checkout for internal members and external clients.",
    metrics: "WhatsApp•integration|Smart•invoice|10+•items", // UBAH format
    imageUrl: "/assets/images/inseterc.png",
    githubUrl: "https://inseterc.web.app/",
    techStack: ["React.js", "Express.js" ,"Firebase" , "API"]
  }
];

export const myActivities: Activity[] = [
  {
    name: "Advanced Coding Teacher at Koding Next | Inspiring 100+ Young Developers",
    imageUrl: "/assets/images/activities/teaching-koding-next.jpeg"
  },
  {
    name: "Lead Programming Instructor | Empowering ELINS Students with Industry-Ready Skills",
    imageUrl: ""
  },
  {
    name: "Keynote Speaker at GIK UGM | Sharing Insights on Tech Innovation & Career Growth",
    imageUrl: ""
  },
  {
    name: "Software Developer Leader | Empowering Farmers in Imogiri with Smart Weather Station Technology",
    imageUrl: "/assets/images/activities/presentation-imogiri.JPG"
  },
  {
    name: "IoT Education Facilitator | Training 30+ Students at MAN 2 Yogyakarta on Smart Technology Integration",
    imageUrl: "/assets/images/activities/man2-yogyakarta.jpeg"
  },
  {
    name: "Student Athlete | Representing Gadjah Mada University in LIMA 2025 National Basketball Competition",
    imageUrl: "/assets/images/activities/lima-basket.jpg"
  }
];