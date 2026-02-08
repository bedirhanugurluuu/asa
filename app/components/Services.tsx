"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function Services() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateIndicatorPosition = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      // Scroll container içindeki relative container'a göre pozisyon hesapla
      const activeTabOffsetLeft = activeTabElement.offsetLeft;
      
      setIndicatorStyle({
        left: activeTabOffsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const scrollContainer = scrollContainerRef.current;
    if (activeTabElement && scrollContainer) {
      updateIndicatorPosition();
      
      // Scroll to active tab on mobile
      if (window.innerWidth < 1024) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const scrollPosition = activeTabElement.offsetLeft - (containerRect.width / 2) + (activeTabElement.offsetWidth / 2);
        scrollContainer.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab, updateIndicatorPosition]);

  // Update indicator position on scroll (mobile)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        updateIndicatorPosition();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateIndicatorPosition, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateIndicatorPosition);
    };
  }, [activeTab, updateIndicatorPosition]);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    
    setIsAnimating(true);
    // Önce animasyonu başlat, sonra içeriği değiştir
    setTimeout(() => {
      setActiveTab(index);
      // Animasyonun başlaması için bir sonraki frame'i bekle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      });
    }, 10);
  };

  return (
    <section className="py-10 lg:py-15 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Küçük başlık */}
        <p className="text-sm uppercase md:text-base text-dark mb-2">
          {t.services.subtitle}
        </p>

        {/* Büyük başlık */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark mb-12">
          {t.services.title.prefix}{" "}
          <span className="font-copernicus italic" style={{ fontFamily: "var(--font-copernicus)", fontStyle: "italic", fontWeight: "300" }}>
            {t.services.title.highlightWord}
          </span>
          <br />
          {t.services.title.suffix}
        </h2>

        {/* Tab Navigation */}
        <div className="relative mb-2 md:mb-8 pb-4">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-4 lg:px-0 lg:overflow-visible lg:snap-none"
          >
            <div className="flex gap-4 lg:justify-between min-w-max lg:min-w-0 relative">
              {t.services.tabs.map((tab, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => handleTabChange(index)}
                  className={`pb-3 md:pb-0px-2 text-sm md:text-base font-medium cursor-pointer transition-colors uppercase whitespace-nowrap snap-start shrink-0 ${
                    activeTab === index
                      ? "text-dark"
                      : "text-gray-600 hover:text-dark"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
              {/* Animated Border Indicator */}
              <div
                className="absolute bottom-0 h-0.5 bg-dark transition-all duration-300 ease-in-out pointer-events-none"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content - Full Width */}
      <div
        className="w-full"
        style={{ backgroundColor: "#072c23" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 lg:py-12">
            {/* Sol taraf - Başlık ve Liste */}
            <div
              className="flex flex-col relative"
              style={{
                backgroundImage: "url(/images/box-bg.svg)",
                backgroundSize: "cover",
                backgroundPosition: "50%",
                padding: "2rem",
                minHeight: "500px",
                maxWidth: "515px",
              }}
            >
              <h3
                className={`text-2xl md:text-3xl font-base text-white mb-3 ${
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
                style={{
                  transition: isAnimating 
                    ? "opacity 0ms, transform 0ms"
                    : "opacity 400ms ease-out 200ms, transform 400ms ease-out 150ms",
                  willChange: isAnimating ? "opacity, transform" : "auto",
                }}
              >
                {t.services.tabs[activeTab].content.title}
              </h3>
              {t.services.tabs[activeTab].content.subtitle && (
                <p
                  className={`text-base md:text-lg text-white/80 mb-6 ${
                    isAnimating
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  }`}
                  style={{
                    transition: isAnimating 
                      ? "opacity 0ms, transform 0ms"
                      : "opacity 400ms ease-out 250ms, transform 400ms ease-out 200ms",
                    willChange: isAnimating ? "opacity, transform" : "auto",
                  }}
                >
                  {t.services.tabs[activeTab].content.subtitle}
                </p>
              )}
              <ul className="space-y-4">
                {t.services.tabs[activeTab].content.items.map((item, index) => (
                  <li
                    key={`${activeTab}-${index}`}
                    className={`text-white text-sm md:text-base leading-relaxed flex items-center gap-3 ${
                      isAnimating
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0"
                    }`}
                    style={{
                      transition: isAnimating
                        ? "opacity 0ms, transform 0ms"
                        : `opacity 400ms ease-out ${300 + index * 150}ms, transform 400ms ease-out ${250 + index * 150}ms`,
                      willChange: isAnimating ? "opacity, transform" : "auto",
                    }}
                  >
                    <svg
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 mt-1"
                      aria-label="Bullet Arrow"
                      aria-hidden="true"
                      style={{ marginTop: "0" }}
                    >
                      <path
                        d="M10.5275 0.998413L15.0232 5.49411M15.0232 5.49411L10.5275 9.9898M15.0232 5.49411L1.53613 5.49411"
                        stroke="currentColor"
                        strokeWidth="1.50038"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sağ taraf - Görsel */}
            <div 
              className={`relative w-full aspect-square lg:aspect-auto lg:h-full min-h-[300px] rounded-lg overflow-hidden ${
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
              style={{
                transition: isAnimating
                  ? "opacity 0ms, transform 0ms"
                  : "opacity 400ms ease-out 300ms, transform 400ms ease-out 200ms",
                willChange: isAnimating ? "opacity, transform" : "auto",
              }}
            >
              <Image
                src={t.services.tabs[activeTab].content.image}
                alt={t.services.tabs[activeTab].name}
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
