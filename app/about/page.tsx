"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroTitle from "../components/HeroTitle";
import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

// Lazy Image Component
function LazyImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imageRef} className="w-full h-full relative">
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      )}
    </div>
  );
}

// Description Section Component
function DescriptionSection({
  description,
  fullDescription,
}: {
  description: string;
  fullDescription: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (descRef.current) {
      observer.observe(descRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={descRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Sol: Description */}
      <div>
        <p 
          className="text-base md:text-lg text-white/70 leading-relaxed"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: isVisible ? "opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s" : "none",
          }}
        >
          {description}
        </p>
      </div>

      {/* Sağ: FullDescription */}
      <div>
        <p 
          className="text-base md:text-lg text-white/70 leading-relaxed"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: isVisible ? "opacity 0.4s ease-out 0.35s, transform 0.4s ease-out 0.35s" : "none",
          }}
        >
          {fullDescription}
        </p>
      </div>
    </div>
  );
}

// Ekip Üyesi Component
function TeamMember({
  member,
  index,
}: {
  member: { name: string; role: string; image: string };
  index: number;
}) {
  const memberRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (memberRef.current) {
      observer.observe(memberRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={memberRef}
      className="w-full max-w-sm mx-auto"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`,
      }}
    >
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative">
        <Image
          src={`/images/${member.image}.png`}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 384px"
        />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-xl font-medium text-dark mb-1">
          {member.name}
        </h3>
        <p className="text-base text-dark/70">{member.role}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const currentLang = useLanguage();
  const t = translations[currentLang];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#071542]">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Üst Grid: h1 ve SVG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
            {/* Sol: h1 */}
            <div>
              <HeroTitle
                title={t.about.subtitle}
                titleClassName="font-normal text-white"
              />
            </div>

            {/* Sağ: SVG */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="md:w-full max-w-md lg:max-w-lg relative">
                <iframe
                  src="/logos/about-illustration.svg"
                  className="w-full h-[400px] border-0"
                  title="ASA Group Animation"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 w-full h-[100px] md:h-[50px] bg-[#071542] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Alt Grid: Description ve FullDescription */}
          <DescriptionSection 
            description={t.about.description}
            fullDescription={t.about.fullDescription}
          />
        </div>
      </section>

      {/* Neden Biz Bölümü */}
      <section className="py-10 lg:py-15 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid: Sol tarafta başlık, açıklama ve liste, sağda görsel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Sol: Başlık, Açıklama ve Özellikler Listesi */}
            <div>
              {/* Küçük başlık */}
              <p className="text-sm uppercase md:text-base text-dark mb-2">
                {t.about.whyUs.subtitle}
              </p>

              {/* Büyük başlık */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-base text-dark mb-6">
                {t.about.whyUs.title.prefix}{" "}
                <span className="font-copernicus text-4xl italic" style={{ fontFamily: "var(--font-copernicus)", fontStyle: "italic", fontWeight: "300" }}>
                  {t.about.whyUs.title.highlightWord}
                </span>
                {t.about.whyUs.title.suffix}
              </h2>

              {/* Açıklama */}
              <p className="text-lg md:text-xl text-dark mb-8">
                {t.about.whyUs.description}
              </p>

              {/* Özellikler Listesi */}
              <ul className="space-y-4">
                {t.about.whyUs.features.map((feature, index) => (
                  <li key={index} className="text-base md:text-lg text-dark flex items-center">
                    <svg
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 mt-1 mr-3 text-dark"
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
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sağ: Fotoğraf Alanı */}
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative">
              <Image
                src="/images/hero-image.jpeg"
                alt="Why ASA Group"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ekibimizle Tanışın Bölümü */}
      <section className="py-10 lg:py-15 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Başlık ve Alt Başlık - Sola Dayalı */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark mb-4">
              {t.about.team.title}
            </h2>
            <p className="text-lg md:text-xl text-dark/70 max-w-3xl">
              {t.about.team.subtitle}
            </p>
          </div>

          {/* Ekip Üyeleri - İki Kolonlu Düzen */}
          <div className="relative flex gap-8">
            {/* Ortadaki Gradient Çizgi */}
            <div
              className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden lg:block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgb(0, 0, 0) 50%, rgba(255, 255, 255, 0) 100%)",
                width: "1px",
              }}
            />

            {/* Sol Kolon: 1, 3, 5 */}
            <div className="flex-1 flex flex-col gap-8">
              {t.about.team.members
                .filter((_, index) => index % 2 === 0)
                .map((member, colIndex) => {
                  const originalIndex = colIndex * 2;
                  return (
                    <TeamMember
                      key={originalIndex}
                      member={member}
                      index={originalIndex}
                    />
                  );
                })}
            </div>

            {/* Sağ Kolon: 2, 4 */}
            <div className="flex-1 flex flex-col gap-8 pt-24">
              {t.about.team.members
                .filter((_, index) => index % 2 === 1)
                .map((member, colIndex) => {
                  const originalIndex = colIndex * 2 + 1;
                  return (
                    <TeamMember
                      key={originalIndex}
                      member={member}
                      index={originalIndex}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Ülkelere Göre Uzmanlık - Bölüm 1: Solda Görsel, Sağda Yazılar */}
      <section className="py-10 lg:py-15 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol: Görsel */}
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative">
              <LazyImage
                src="/images/expertise-1.jpg"
                alt="Expertise"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Sağ: Yazılar */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark mb-4">
                  {t.about.expertise.title}
                </h2>
                <p className="text-base md:text-lg text-dark/70 leading-relaxed">
                  {t.about.expertise.description}
                </p>
              </div>

              {/* İngiltere */}
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-dark mb-3 flex items-center gap-2">
                  <span>{t.about.expertise.countries.uk.flag}</span>
                  <span>{t.about.expertise.countries.uk.name}</span>
                </h3>
                <ul className="space-y-2">
                  {t.about.expertise.countries.uk.items.map((item, index) => (
                    <li key={index} className="text-base md:text-lg text-dark/80 flex items-center">
                      <svg
                        width="16"
                        height="11"
                        viewBox="0 0 16 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 mt-1 mr-3 text-dark"
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

              {/* Türkiye */}
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-dark mb-3 flex items-center gap-2">
                  <span>{t.about.expertise.countries.tr.flag}</span>
                  <span>{t.about.expertise.countries.tr.name}</span>
                </h3>
                <ul className="space-y-2">
                  {t.about.expertise.countries.tr.items.map((item, index) => (
                    <li key={index} className="text-base md:text-lg text-dark/80 flex items-center">
                      <svg
                        width="16"
                        height="11"
                        viewBox="0 0 16 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 mt-1 mr-3 text-dark"
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
            </div>
          </div>
        </div>
      </section>

      {/* Ülkelere Göre Uzmanlık - Bölüm 2: Sağda Görsel, Solda Yazılar */}
      <section className="py-10 lg:py-15 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol: Yazılar */}
            <div className="space-y-8 order-2 md:order-1">
              {/* Yunanistan */}
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-dark mb-3 flex items-center gap-2">
                  <span>{t.about.expertise.countries.gr.flag}</span>
                  <span>{t.about.expertise.countries.gr.name}</span>
                </h3>
                <ul className="space-y-2">
                  {t.about.expertise.countries.gr.items.map((item, index) => (
                    <li key={index} className="text-base md:text-lg text-dark/80 flex items-center">
                      <svg
                        width="16"
                        height="11"
                        viewBox="0 0 16 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 mt-1 mr-3 text-dark"
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

              {/* Dubai */}
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-dark mb-3 flex items-center gap-2">
                  <span>{t.about.expertise.countries.ae.flag}</span>
                  <span>{t.about.expertise.countries.ae.name}</span>
                </h3>
                <ul className="space-y-2">
                  {t.about.expertise.countries.ae.items.map((item, index) => (
                    <li key={index} className="text-base md:text-lg text-dark/80 flex items-center">
                      <svg
                        width="16"
                        height="11"
                        viewBox="0 0 16 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 mt-1 mr-3 text-dark"
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
            </div>

            {/* Sağ: Görsel */}
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative order-1 md:order-2">
              <LazyImage
                src="/images/expertise-2.jpg"
                alt="Expertise"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}