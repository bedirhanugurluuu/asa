"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const pathname = usePathname();
  const currentLang = useLanguage();
  const t = translations[currentLang];
  
  // Ana sayfa kontrolü
  const isHomePage = pathname === "/" || pathname === "/en";

  // Scroll dinleyicisi - throttled for performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Dil değiştirme
  const changeLanguage = (lang: "tr" | "en") => {
    setIsLangOpen(false);
    if (typeof window !== "undefined") {
      // Mevcut path'i al
      const currentPath = pathname;
      
      if (lang === "tr") {
        // TR için /en prefix'ini kaldır
        const newPath = currentPath.startsWith("/en") 
          ? currentPath.replace("/en", "") || "/"
          : currentPath;
        window.location.href = newPath;
      } else {
        // EN için /en prefix'i ekle (yoksa)
        const newPath = currentPath.startsWith("/en")
          ? currentPath
          : `/en${currentPath === "/" ? "" : currentPath}`;
        window.location.href = newPath;
      }
    }
  };

  // Header stil hesaplama
  const getHeaderStyles = () => {
    // Ana sayfa dışındaki sayfalarda her zaman beyaz arka plan
    if (!isHomePage) {
      return {
        background: "rgba(255, 255, 255, 1)",
        borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)",
      };
    }

    // Ana sayfa için mevcut davranış
    if (isHovered) {
      return {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(0, 0, 0, 0.5)",
      };
    }

    if (isScrolled) {
      return {
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, .15) 9.15%, rgba(255, 255, 255, 0))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)", // Safari desteği
        borderBottom: "0.5px solid rgba(0, 0, 0, 0.5)",
      };
    }

    return {
      background: "transparent",
      borderBottom: "0.5px solid rgba(0, 0, 0, 0)",
    };
  };

  return (
    <>
      {/* Overlay - Dropdown açıkken göster */}
      {isLangOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsLangOpen(false)}
        />
      )}

      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          ...getHeaderStyles(),
          transition:
            "background-color 0.26s ease, border-bottom-color 0.26s ease, backdrop-filter 0.26s ease, -webkit-backdrop-filter 0.26s ease",
          willChange: "background-color, backdrop-filter",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sol taraf: Logo ve Nav Menu */}
          <div className="flex items-center gap-20">
            <Link href={currentLang === "en" ? "/en" : "/"} className="flex items-center">
              <Image
                src="/logos/logo.png"
                alt="ASA Logo"
                width={51}
                height={40}
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback to SVG if PNG doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.src = "/logos/asa-logo.svg";
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href={currentLang === "en" ? "/en/airbnb-management" : "/airbnb-management"}
                className="text-dark hover:opacity-80 transition-colors"
              >
                {t.header.nav.services}
              </Link>
              <Link
                href={currentLang === "en" ? "/en/about" : "/about"}
                className="text-dark hover:opacity-80 transition-colors"
              >
                {t.header.nav.about}
              </Link>
              <Link
                href={currentLang === "en" ? "/en/contact" : "/contact"}
                className="text-dark hover:opacity-80 transition-colors"
              >
                {t.header.nav.contact}
              </Link>
            </div>
          </div>

          {/* Sağ taraf: Desktop - Dil Seçici ve Get Started */}
          <div className="hidden md:flex items-center space-x-4">
            <div 
              className="relative h-16 flex items-center"
              onMouseEnter={() => setIsLangOpen(true)}
              onMouseLeave={() => setIsLangOpen(false)}
            >
              <button
                className="flex items-center space-x-2 px-3 py-2 text-dark hover:opacity-80 transition-colors h-full"
              >
                <span className="font-medium uppercase">{currentLang}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isLangOpen ? "rotate-180" : ""
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

              {/* Dropdown Menu - Button'un tam altında, sadece alt köşeler yuvarlatılmış */}
              {isLangOpen && (
                <div className="absolute right-0 top-full w-20 bg-white rounded-b-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => changeLanguage("tr")}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors cursor-pointer ${
                      currentLang === "tr"
                        ? "bg-gray-50 font-semibold"
                        : "font-normal"
                    }`}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors cursor-pointer ${
                      currentLang === "en"
                        ? "bg-gray-50 font-semibold"
                        : "font-normal"
                    }`}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            {/* Get Started Button */}
            <Link 
              href={currentLang === "en" ? "/en/quote" : "/quote"}
              className="px-4 py-2 bg-dark text-white rounded-md hover:opacity-90 transition-opacity text-sm md:text-base"
            >
              {t.header.nav.getStarted}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-dark relative z-[60]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <div className="w-6 h-6 relative flex flex-col justify-center">
              {/* Hamburger lines */}
              <span
                className={`absolute w-6 h-[2px] bg-dark transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 top-[8px]" : "top-0"
                }`}
                style={{ transformOrigin: "center" }}
              />
              <span
                className={`absolute w-6 h-[2px] bg-dark transition-all duration-300 ease-in-out top-[8px] ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute w-6 h-[2px] bg-dark transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 top-[8px]" : "top-[16px]"
                }`}
                style={{ transformOrigin: "center" }}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Full Height */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-[45]" style={{ top: '64px' }}>
            <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 sm:px-6 py-8 bg-white">
              <div className="flex flex-col h-full">
                {/* Navigation Links */}
                <div className="space-y-6 mb-8">
                  <Link
                    href={currentLang === "en" ? "/en/airbnb-management" : "/airbnb-management"}
                    className="block text-dark hover:opacity-80 transition-colors text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.header.nav.services}
                  </Link>
                  <Link
                    href={currentLang === "en" ? "/en/about" : "/about"}
                    className="block text-dark hover:opacity-80 transition-colors text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.header.nav.about}
                  </Link>
                  <Link
                    href={currentLang === "en" ? "/en/contact" : "/contact"}
                    className="block text-dark hover:opacity-80 transition-colors text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.header.nav.contact}
                  </Link>
                </div>

                {/* Language Selector */}
                <div className="mb-8">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-600 mb-4 uppercase font-medium">Language</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          changeLanguage("tr");
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-md transition-colors font-medium ${
                          currentLang === "tr"
                            ? "bg-dark text-white"
                            : "bg-gray-100 text-dark hover:bg-gray-200"
                        }`}
                      >
                        TR
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage("en");
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-md transition-colors font-medium ${
                          currentLang === "en"
                            ? "bg-dark text-white"
                            : "bg-gray-100 text-dark hover:bg-gray-200"
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                {/* Get Started Button */}
                <div className="mt-auto pb-8">
                  <Link
                    href={currentLang === "en" ? "/en/quote" : "/quote"}
                    className="block w-full text-center px-6 py-2 bg-dark text-white rounded-md hover:opacity-90 transition-opacity text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.header.nav.getStarted}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  );
}
