"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface HeroTitleProps {
  title?: string;
  titleContent?: ReactNode;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  reverseOrder?: boolean; // subtitle üstte, title altta (default: false)
}

export default function HeroTitle({
  title,
  titleContent,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  reverseOrder = false,
}: HeroTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde hemen animasyonu başlat
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Ayrıca Intersection Observer da ekle (scroll için)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const titleDelay = reverseOrder ? "0.15s" : (subtitle ? "0.15s" : "0s");
  const subtitleDelay = reverseOrder ? "0s" : "0s";

  return (
    <div ref={titleRef} className={className}>
      {reverseOrder ? (
        <>
          {(title || titleContent) && (
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-medium text-dark leading-tight mb-4 ${titleClassName}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.4s ease-out ${titleDelay}, transform 0.4s ease-out ${titleDelay}`,
              }}
            >
              {title || titleContent}
            </h1>
          )}
          {subtitle && (
            <p
              className={`text-lg md:text-xl text-dark/70 leading-relaxed ${subtitleClassName}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.4s ease-out ${subtitleDelay}, transform 0.4s ease-out ${subtitleDelay}`,
              }}
            >
              {subtitle}
            </p>
          )}
        </>
      ) : (
        <>
          {subtitle && (
            <p
              className={`text-sm uppercase md:text-base text-dark mb-2 ${subtitleClassName}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
              }}
            >
              {subtitle}
            </p>
          )}
          {(title || titleContent) && (
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-medium text-dark leading-tight mb-4 ${titleClassName}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: subtitle 
                  ? "opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s"
                  : "opacity 0.4s ease-out, transform 0.4s ease-out",
              }}
            >
              {title || titleContent}
            </h1>
          )}
        </>
      )}
    </div>
  );
}
