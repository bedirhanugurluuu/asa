"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroTitle from "../components/HeroTitle";
import Services from "../components/Services";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function AirbnbManagementPage() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBoxVisible(true);
    }, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBoxVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-20" style={{ backgroundColor: "#faf5f0" }}>
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol: Yeşil Box */}
            <div ref={boxRef} className="relative">
              {/* Fotoğraf - Absolute pozisyon */}
              <div
                className="absolute top-0 left-0 w-full h-[300px] bg-gray-200 rounded-lg overflow-hidden z-10"
                style={{
                  opacity: isBoxVisible ? 1 : 0,
                  transform: isBoxVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                }}
              >
                <Image
                  src="/images/hero-image.jpeg"
                  alt="Airbnb Management"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>

              {/* Yeşil Box - Küçük */}
              <div
                className="bg-[#072c23] rounded-lg p-6 md:p-8 flex flex-col justify-end mx-auto"
                style={{
                  maxWidth: "400px",
                  minHeight: "400px",
                  marginTop: "120px",
                  opacity: isBoxVisible ? 1 : 0,
                  transform: isBoxVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s",
                }}
              >
                <div className="text-white">
                  <p className="text-lg md:text-xl font-medium">
                    {t.about.airbnbManagement.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ: Title ve Subtitle */}
            <div className="space-y-6">
              <HeroTitle
                title={t.about.airbnbManagement.title}
                subtitle={t.about.airbnbManagement.subtitle}
                reverseOrder={true}
              />
              
              {/* Başlayın Butonu */}
              <Link
                href={currentLang === "en" ? "/en/quote" : "/quote"}
                className="inline-flex items-center gap-3 px-6 py-3 bg-dark text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <span>{t.about.airbnbManagement.button}</span>
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M10.5275 0.998413L15.0232 5.49411M15.0232 5.49411L10.5275 9.9898M15.0232 5.49411L1.53613 5.49411"
                    stroke="currentColor"
                    strokeWidth="1.50038"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Misafir Deneyimi Bölümü */}
      <section className="py-10 lg:py-15">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Sol: Accordion */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-dark mb-8">
                {t.about.airbnbManagement.guestExperience.title}
              </h2>
              
              <div className="space-y-4">
                {t.about.airbnbManagement.guestExperience.items.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full py-2 text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium text-dark pr-4">{item.title}</span>
                      <svg
                        className={`w-5 h-5 text-dark transition-transform shrink-0 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openIndex === index && (
                      <div className="py-4 border-t border-gray-200">
                        <p className="text-sm text-dark/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: Görsel */}
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative">
              <Image
                src="/images/guest-experience.jpeg"
                alt="Guest Experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Bölümü */}
      <Services />

      <Footer />
    </main>
  );
}
