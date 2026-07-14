export interface Social {
  name: string;
  url: string;
  iconName: 'Linkedin' | 'Github' | 'Instagram';
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
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Web Development",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "Vite", "HTML & CSS", "Responsive Design", "UI/UX"]
  },
  {
    title: "Backend & Database",
    skills: ["Node.js", "Express.js", "FastAPI", "RESTful APIs", "Python", "PHP", "Laravel", "CakePHP", "Prisma ORM", "MySQL", "PostgreSQL", "SQLite", "Firebase", "SQL"]
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
    iconName: "Linkedin"
  },
  {
    name: "GitHub",
    url: "https://github.com/hanifnugrahaa",
    iconName: "Github"
  },
  {
    name: "Instagram",
    url:"https://www.instagram.com/haniffnugraha/",
    iconName: "Instagram"
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
    name: "Lead Programming Instructor | Empowering ELINS Students with Industry-Ready Skills"
  },
  {
    name: "Keynote Speaker at GIK UGM | Sharing Insights on Tech Innovation & Career Growth"
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