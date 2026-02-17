"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import HeroTitle from "../components/HeroTitle";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function ContactPage() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Sol: Başlık ve Açıklama */}
            <div ref={contentRef} className="space-y-6">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark leading-tight"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                }}
              >
                {t.contact.title}
              </h1>
              <p
                className="text-lg md:text-xl text-dark/70 leading-relaxed"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s",
                }}
              >
                {t.contact.subtitle}
              </p>

              <div className="flex items-center justify-center">
                <div className="md:w-full max-w-md lg:max-w-lg relative">
                  <iframe
                    src="/logos/about-illustration-contact.svg"
                    className="w-full h-[400px] border-0"
                    title="ASA Group Animation"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[100px] md:h-[50px] bg-[#fff] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sağ: Form */}
            <div>
              <Contact showTitle={false} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
