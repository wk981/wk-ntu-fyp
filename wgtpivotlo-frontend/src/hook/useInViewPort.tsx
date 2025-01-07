import { useState, useEffect, useRef } from 'react';

// Source: https://medium.com/@serifcolakel/utilizing-intersection-observer-with-custom-react-hook-in-typescript-5a27575ee154
function useInViewPort(options?: IntersectionObserverInit) {
  const [inViewport, setInViewport] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting);
    }, options);
    const currentRef = targetRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, targetRef]);
  return { inViewport, targetRef };
}
export default useInViewPort;
