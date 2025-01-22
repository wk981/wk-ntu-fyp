import { useEffect, useRef, useState } from 'react';

export const useScrollToNextDiv = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop - windowHeight / 2 && scrollPosition < sectionBottom - windowHeight / 2) {
          setActiveSection(i);
          break;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0 && activeSection < sectionsRef.current.length - 1) {
        // Scrolling down
        sectionsRef.current[activeSection + 1].scrollIntoView({ behavior: 'smooth' });
      } else if (e.deltaY < 0 && activeSection > 0) {
        // Scrolling up
        sectionsRef.current[activeSection - 1].scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection]);

  return { sectionsRef };
};
