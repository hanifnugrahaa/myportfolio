import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiPython,
  SiPrisma,
  SiMysql,
  SiSqlite,
  SiFirebase,
  SiEspressif,
  SiArduino,
  SiMqtt,
  SiNodered,
  SiCplusplus,
  SiGit,
  SiDocker,
  SiKotlin,
  SiAndroid,
  SiPhp,
  SiLaravel,
  SiCakephp,
  SiPostgresql,
  SiVite
} from 'react-icons/si';

import { FaJava } from 'react-icons/fa6';

import {
  Code2,
  Smartphone,
  Layout,
  Network,
  Database,
  Cpu,
  Plug,
  Zap,
  Binary,
  GitBranch,
  Box,
  Lightbulb,
  Wifi
} from 'lucide-react';

interface SkillIconProps {
  skill: string;
  className?: string;
}

const SkillIcon: React.FC<SkillIconProps> = ({ skill, className = "w-3 h-3 md:w-4 md:h-4 mr-1.5" }) => {
  switch (skill) {
    case "JavaScript": return <SiJavascript className={className} color="#F7DF1E" />;
    case "TypeScript": return <SiTypescript className={className} color="#3178C6" />;
    case "React": return <SiReact className={className} color="#61DAFB" />;
    case "Next.js": return <SiNextdotjs className={className} />; // adapts to theme
    case "Vite": return <SiVite className={className} color="#646CFF" />;
    case "HTML & CSS": return <SiHtml5 className={className} color="#E34F26" />;
    case "Responsive Design": return <Smartphone className={className} color="#10B981" />;
    case "UI/UX": return <Layout className={className} color="#EC4899" />;
    case "Node.js": return <SiNodedotjs className={className} color="#339933" />;
    case "Express.js": return <SiExpress className={className} />; // adapts to theme
    case "FastAPI": return <SiFastapi className={className} color="#009688" />;
    case "RESTful APIs": return <Network className={className} color="#8B5CF6" />;
    case "Python": return <SiPython className={className} color="#3776AB" />;
    case "PHP": return <SiPhp className={className} color="#777BB4" />;
    case "Laravel": return <SiLaravel className={className} color="#FF2D20" />;
    case "CakePHP": return <SiCakephp className={className} color="#D33C43" />;
    case "Prisma ORM": return <SiPrisma className={className} />; // adapts to theme
    case "MySQL": return <SiMysql className={className} color="#4479A1" />;
    case "PostgreSQL": return <SiPostgresql className={className} color="#4169E1" />;
    case "SQLite": return <SiSqlite className={className} color="#003B57" />;
    case "Firebase": return <SiFirebase className={className} color="#FFCA28" />;
    case "SQL": return <Database className={className} color="#F97316" />;
    case "IoT": return <Wifi className={className} color="#06B6D4" />;
    case "ESP32": return <SiEspressif className={className} color="#E7352C" />;
    case "Arduino": return <SiArduino className={className} color="#00979D" />;
    case "Embedded Systems": return <Cpu className={className} color="#64748B" />;
    case "MQTT": return <SiMqtt className={className} color="#660066" />;
    case "Socket Programming": return <Plug className={className} color="#F43F5E" />;
    case "Node-RED": return <SiNodered className={className} color="#8F0000" />;
    case "Elektronika": return <Zap className={className} color="#EAB308" />;
    case "C++": return <SiCplusplus className={className} color="#00599C" />;
    case "Data Structures": return <Binary className={className} color="#14B8A6" />;
    case "Algorithms": return <GitBranch className={className} color="#F43F5E" />;
    case "Object-Oriented Programming (OOP)": return <Box className={className} color="#8B5CF6" />;
    case "Git": return <SiGit className={className} color="#F05032" />;
    case "Docker": return <SiDocker className={className} color="#2496ED" />;
    case "Java": return <FaJava className={className} color="#007396" />;
    case "Kotlin": return <SiKotlin className={className} color="#7F52FF" />;
    case "Android Development": return <SiAndroid className={className} color="#3DDC84" />;
    case "Problem Solving": return <Lightbulb className={className} color="#EAB308" />;
    default: return <Code2 className={className} />;
  }
};

export default SkillIcon;
