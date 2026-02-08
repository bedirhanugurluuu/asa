"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function NotFound() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const homeUrl = currentLang === "en" ? "/en" : "/";

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold text-dark/10 mb-4">
              {t.notFound.title}
            </h1>
            <h2 className="text-3xl md:text-5xl font-medium text-dark mb-4">
              {t.notFound.subtitle}
            </h2>
            <p className="text-lg md:text-xl text-dark/70 mb-8 max-w-2xl mx-auto">
              {t.notFound.description}
            </p>
          </div>
          
          <Link
            href={homeUrl}
            className="inline-block px-8 py-4 bg-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-lg"
          >
            {t.notFound.button}
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
