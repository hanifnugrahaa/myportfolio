// src/components/AnimatedSection.jsx

import { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
}

// Terima 'children' dan 'id' sebagai prop
function AnimatedSection({ children, id }: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        if (sectionRef.current) observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id={id} // Gunakan id dari prop
      ref={sectionRef}
      className="content-section"
      data-visible={isVisible}
    >
      {children}
    </section>
  );
}

export default AnimatedSection;