import React from 'react';
import { 
  SiTailwindcss, 
  SiTypescript, 
  SiFirebase, 
  SiFramer, 
  SiNextdotjs, 
  SiVite, 
  SiVercel,
  SiMongodb,
  SiPostgresql,
  SiExpress
} from 'react-icons/si';
import { 
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaNodeJs,
  FaGithub,
  FaPython,
  FaFigma
} from 'react-icons/fa';
import { Code } from 'lucide-react';

interface TechIconProps {
  name: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = "w-3 h-3" }) => {
  const n = name.toLowerCase();
  
  if (n.includes('react')) return <FaReact className={className} />;
  if (n.includes('tailwind')) return <SiTailwindcss className={className} />;
  if (n.includes('typescript') || n.includes('ts')) return <SiTypescript className={className} />;
  if (n.includes('javascript') || n.includes('js')) return <FaJs className={className} />;
  if (n.includes('firebase')) return <SiFirebase className={className} />;
  if (n.includes('framer')) return <SiFramer className={className} />;
  if (n.includes('next')) return <SiNextdotjs className={className} />;
  if (n.includes('vite')) return <SiVite className={className} />;
  if (n.includes('node')) return <FaNodeJs className={className} />;
  if (n.includes('vercel')) return <SiVercel className={className} />;
  if (n.includes('html')) return <FaHtml5 className={className} />;
  if (n.includes('css')) return <FaCss3Alt className={className} />;
  if (n.includes('github')) return <FaGithub className={className} />;
  if (n.includes('python')) return <FaPython className={className} />;
  if (n.includes('figma')) return <FaFigma className={className} />;
  if (n.includes('mongo')) return <SiMongodb className={className} />;
  if (n.includes('postgres') || n.includes('sql')) return <SiPostgresql className={className} />;
  if (n.includes('express')) return <SiExpress className={className} />;
  
  return <Code className={className} />;
};
