import { useEffect, useRef, useState } from "react";

/**
 * Section component with optional fade-in animation on scroll
 * Uses IntersectionObserver for subtle animations
 */
const Section = ({
  children,
  className = "",
  animate = true,
  id,
  as: Component = "section"
}) => {
  const [isVisible, setIsVisible] = useState(!animate);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animate]);

  return (
    <Component
      ref={sectionRef}
      id={id}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </Component>
  );
};

export default Section;
