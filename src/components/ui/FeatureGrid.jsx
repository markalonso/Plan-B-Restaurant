import { useEffect, useRef, useState } from "react";

/**
 * FeatureGrid component for displaying images in a responsive grid
 * - Mobile: horizontal scroll
 * - Desktop: grid layout
 * - Subtle fade-in animation on scroll
 */
const FeatureGrid = ({
  items,
  columns = 3,
  className = "",
  imageClassName = "",
  scrollOnMobile = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = gridRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const gridColsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4"
  };

  if (scrollOnMobile) {
    return (
      <div
        ref={gridRef}
        className={`transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
      >
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:hidden">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex-shrink-0 transition-all duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 w-64 overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.alt || item.title || ""}
                  className={`h-full w-full object-cover ${imageClassName}`}
                  loading="lazy"
                />
                {item.title && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4">
                    <span className="text-sm font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className={`hidden gap-6 md:grid ${gridColsClass[columns] || gridColsClass[3]}`}>
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`group transition-all duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.alt || item.title || ""}
                  className={`h-64 w-full object-cover transition duration-500 group-hover:scale-105 ${imageClassName}`}
                  loading="lazy"
                />
                {item.title && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={`grid gap-6 ${gridColsClass[columns] || gridColsClass[3]} ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`group transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={item.image}
              alt={item.alt || item.title || ""}
              className={`h-64 w-full object-cover transition duration-500 group-hover:scale-105 ${imageClassName}`}
              loading="lazy"
            />
            {item.title && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-coffee-dark/70 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="text-sm font-semibold text-white">
                  {item.title}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;
