"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

export default function PropertyManagement() {
  const currentLang = useLanguage();
  const t = translations[currentLang];

  return (
    <section className="py-10 lg:py-15 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <p className="text-sm uppercase md:text-base text-dark mb-2">
          {t.propertyManagementTop.subtitle}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark mb-12">
          {t.propertyManagement.title.prefix}
          <br />
          <span className="font-copernicus italic" style={{ fontFamily: "var(--font-copernicus)", fontStyle: "italic", fontWeight: "300" }}>
            {t.propertyManagement.title.highlightWord}
          </span>{" "}
          {t.propertyManagement.title.suffix}
        </h2>

        {/* 3 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {t.propertyManagement.cards.map((card, index) => (
            <div
              key={index}
              className="overflow-hidden"
            >
              {/* Üstte görsel/video */}
              <div className="relative w-full aspect-square bg-gray-200"  style={{ borderRadius: "10px 10px 10px 56px" }}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    style={{ borderRadius: "10px 10px 10px 36px" }}
                  />
              </div>

              {/* Altta title ve subtitle */}
              <div className="py-6">
                <h3 className="text-2xl font-semibold text-dark mb-2">
                  {card.title}
                </h3>
                <p className="text-dark text-base">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
