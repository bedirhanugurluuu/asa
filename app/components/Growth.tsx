"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function Growth() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-10 lg:py-15 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Küçük başlık */}
        <p className="text-sm md:text-base font-base text-dark mb-2">
          {t.growth.subtitle}
        </p>

        {/* Büyük başlık */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark mb-12">
          {t.growth.title.prefix}{" "}
          <span className="font-copernicus italic" style={{ fontFamily: "var(--font-copernicus)", fontStyle: "italic", fontWeight: "300" }}>
            {t.growth.title.highlightWord}
          </span>{" "}
          {t.growth.title.middle}
          <br />
          {t.growth.title.suffix}
        </h2>

        {/* Sticky Scroll Görselleri */}
        <div className="relative">
          {t.growth.sections.map((section, index) => (
            <div
              key={index}
              className="sticky"
              style={{
                top: isMobile ? "64px" : "64px",
                zIndex: index + 1,
                marginTop: index === 0 ? "0" : isMobile ? "-10vh" : "-20vh",
                marginBottom: index < t.growth.sections.length - 1 ? "0" : "0",
              }}
            >
              <div className="relative w-full aspect-[4/3] md:aspect-[16/9] min-h-[500px] md:min-h-0 bg-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />

                {/* Hafif karartı overlay */}
                <div className="absolute inset-0 bg-black/30 z-10"></div>

                {/* Sol üstte başlık */}
                <div className="absolute top-6 left-4 md:top-16 md:left-16 z-20">
                  <h3 className="text-xl md:text-2xl lg:text-4xl font-semibold text-white mb-3 md:mb-4">
                    {section.title}
                  </h3>
                  
                  {/* ASA Badge */}
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      background: "linear-gradient(128.28deg, rgba(255, 255, 255, .5) 17.8%, rgba(255, 255, 255, .15) 131.27%)",
                      backdropFilter: "blur(9px)",
                      WebkitBackdropFilter: "blur(9px)",
                      color: "#fff",
                      border: ".5px solid #fff",
                      fontWeight: 600,
                      fontSize: "11px",
                      lineHeight: "11px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      display: "inline-block",
                    }}
                    className="md:text-[13px] md:leading-[13px] md:p-2 md:px-4 md:rounded-lg"
                  >
                    ASA
                  </div>
                </div>

                {/* Sağ üstte yazı */}
                <div className="absolute top-28 right-4 md:top-16 md:right-16 max-w-[calc(100%-2rem)] md:max-w-md z-20">
                  <p className="text-white text-xs md:text-sm lg:text-base leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
