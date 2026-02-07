"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";
import HeroTitle from "./HeroTitle";
import { IoCreateOutline, IoCameraOutline, IoPricetagOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { GiVacuumCleaner } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";



export default function Hero() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const rotatingWords = t.hero.rotatingWords;
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Kelime rotasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  // Grid animasyonu
  useEffect(() => {
    // Sayfa yüklendiğinde hemen animasyonu başlat
    const timer = setTimeout(() => {
      setIsGridVisible(true);
    }, 200);

    // Ayrıca Intersection Observer da ekle (scroll için)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsGridVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="pt-25 pb-20 px-4 sm:px-6 lg:px-8 bg-[#faf5f0]">
      <div className="max-w-7xl mx-auto">
        {/* Üst kısım: Yazılar */}
        <div className="mb-4">
          <HeroTitle
            subtitle={t.hero.subtitle}
            titleContent={
              <>
                {t.hero.title.prefix}
                <br />
                <span className="relative inline-block min-w-[200px] md:min-w-[250px]">
                  <span
                    key={currentWordIndex}
                    className="animate-fade-in font-copernicus italic"
                    style={{ fontFamily: "var(--font-copernicus)", fontStyle: "italic", fontWeight: "300" }}
                  >
                    {rotatingWords[currentWordIndex]}
                  </span>
                </span>
                <br />
                {t.hero.title.suffix}
              </>
            }
            titleClassName="font-normal"
            subtitleClassName="mb-2"
          />
        </div>

        {/* 2 küçük görsel yan yana */}
        <div className="flex gap-4 mb-8 max-w-2xl">
          <div className="relative w-[60px] h-[48px]">
            <Image
              src="/logos/airbnb-logo.svg"
              alt="Airbnb"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-[96px] h-[48px]">
            <Image
              src="/logos/booking-logo.svg"
              alt="Booking.com"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Blur'lu ana görsel ve sağdaki bilgi kutusu */}
        <div className="relative mb-8 lg:mb-0">
          {/* Blur'lu ana görsel */}
          <div
            className="relative aspect-video max-w-5xl rounded-2xl overflow-hidden transition-opacity duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ willChange: "opacity" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/images/hero-image.jpeg"
                alt="Hero Image"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
              />
            </div>
            {/* Overlay - blur yerine opacity kullanıyoruz */}
            <div
              className={`absolute inset-0 bg-black/10 transition-opacity duration-500 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
              style={{ willChange: "opacity" }}
            />
          </div>

          {/* Sağdaki bilgi kutusu */}
          <div 
            ref={gridRef}
            className="absolute right-0 top-0 -translate-y-1/2 w-full max-w-[460px] hidden lg:block"
            style={{
              opacity: isGridVisible ? 1 : 0,
              transform: isGridVisible 
                ? "translateX(0) translateY(0)" 
                : "translateX(100px) translateY(0)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
          >
            {/* Dış wrapper div */}
            <div
              style={{
                background: "hsla(0, 0%, 100%, .5)",
                border: "2px solid #fff",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "20px 20px 20px 58px",
                padding: "10px",
                boxShadow: "0 16px 64px 0 rgba(51, 26, 0, .2)",
                willChange: "transform",
              }}
            >
            {/* İçerik div */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100" style={{ borderRadius: "20px 20px 20px 51px", }}>
              {/* Booking ve Airbnb logoları + puanlar */}
            <div className="flex gap-4 items-center space-y-4 mb-6">
              {/* Airbnb */}
              <div className="flex items-center gap-1 mb-0">
                <div className="w-6 h-4">
                <Image
                    src="/logos/airbnb-logo.jpg"
                    alt="Airbnb"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-sm font-semibold text-gray-700 ml-1">
                        4.6
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Booking.com */}
              <div className="flex items-center gap-1">
                <div className="w-4 h-4">
                  <Image
                    src="/logos/booking-logo1.svg"
                    alt="ASA"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-sm font-semibold text-gray-700 ml-1">
                        4.8
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt kısım - 6 Kare Grid */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {/* İlan oluşturma */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <IoCreateOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.listing}
                  </h3>
                </div>

                {/* Fotoğraf */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <IoCameraOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.photography}
                  </h3>
                </div>

                {/* Fiyatlandırma */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <IoPricetagOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.pricing}
                  </h3>
                </div>

                {/* 7/24 iletişim */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <IoPhonePortraitOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.support}
                  </h3>
                </div>

                {/* Temizlik */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <GiVacuumCleaner className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.cleaning}
                  </h3>
                </div>

                {/* Aylık raporlama */}
                <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                  <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                    <TbReportAnalytics className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                    {t.hero.services.reporting}
                  </h3>
                </div>
              </div>
              
              {/* İletişime geçin butonu */}
              <div className="mt-6 flex justify-center">
                <button className="px-8 py-3 bg-dark text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  {t.hero.services.contactButton}
                </button>
              </div>
            </div>
              </div>
            </div>
          </div>

          {/* Mobil için bilgi kutusu (altında) */}
          <div className="lg:hidden mt-6 w-full">
            {/* Dış wrapper div */}
            <div
              style={{
                background: "hsla(0, 0%, 100%, .5)",
                border: "2px solid #fff",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "20px 20px 20px 58px",
                padding: "10px",
                boxShadow: "0 16px 64px 0 rgba(51, 26, 0, .2)",
                willChange: "transform",
              }}
            >
              {/* İçerik div */}
              <div className="bg-white rounded-xl shadow-2xl px-2 md:px-6 py-6 border border-gray-100" style={{ borderRadius: "20px 20px 20px 51px" }}>
                {/* Booking ve Airbnb logoları + puanlar */}
                <div className="flex gap-4 items-center space-y-4 mb-6">
                  {/* Airbnb */}
                  <div className="flex items-center gap-1 mb-0">
                    <div className="w-6 h-4">
                      <Image
                        src="/logos/airbnb-logo.jpg"
                        alt="Airbnb"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            4.6
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Booking.com */}
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4">
                      <Image
                        src="/logos/booking-logo1.svg"
                        alt="ASA"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            4.8
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alt kısım - 6 Kare Grid */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {/* İlan oluşturma */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <IoCreateOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.listing}
                      </h3>
                    </div>

                    {/* Fotoğraf */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <IoCameraOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.photography}
                      </h3>
                    </div>

                    {/* Fiyatlandırma */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <IoPricetagOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.pricingMobile}
                      </h3>
                    </div>

                    {/* 7/24 iletişim */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <IoPhonePortraitOutline className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.support}
                      </h3>
                    </div>

                    {/* Temizlik */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <GiVacuumCleaner className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.cleaning}
                      </h3>
                    </div>

                    {/* Aylık raporlama */}
                    <div className="group aspect-square bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-[#3E5765]">
                      <div className="w-12 h-12 bg-[#f5f6f7] rounded-full mb-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#3E5765]">
                        <TbReportAnalytics className="w-6 h-6 text-gray-700 group-hover:text-[#ffffff] transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm h-10 font-medium text-gray-900 text-center group-hover:text-[#3E5765] transition-colors duration-300">
                        {t.hero.services.reporting}
                      </h3>
                    </div>
                  </div>
                  
                  {/* İletişime geçin butonu */}
                  <div className="mt-6 flex justify-center">
                    <button className="px-8 py-3 bg-dark text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                      {t.hero.services.contactButton}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
