
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ 
    children, 
    width = "fit-content", 
    delay = 0, 
    direction = "up",
    duration = 0.6,
    className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // On déconnecte pour que l'animation ne se joue qu'une fois
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { 
        threshold: 0.15, // Déclenche quand 15% de l'élément est visible
        rootMargin: "0px 0px -50px 0px" 
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  const getTransform = () => {
      if (!isVisible) {
          switch (direction) {
              case 'up': return 'translateY(40px)';
              case 'down': return 'translateY(-40px)';
              case 'left': return 'translateX(40px)';
              case 'right': return 'translateX(-40px)';
              default: return 'translateY(40px)';
          }
      }
      return 'translate(0)';
  };

  return (
    <div ref={ref} className={className} style={{ position: 'relative', width }}>
      <div
        style={{
          transform: getTransform(),
          opacity: isVisible ? 1 : 0,
          transition: `all ${duration}s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Reveal;
