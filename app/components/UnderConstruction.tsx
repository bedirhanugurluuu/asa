"use client";

import Image from "next/image";
import { FaAirbnb } from "react-icons/fa";

export default function UnderConstruction() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f5f2] via-white to-[#f7f5f2] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <Image
            src="/logos/logo.png"
            alt="ASA Group Logo"
            width={180}
            height={60}
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logos/asa-logo.svg";
            }}
          />
        </div>

        {/* Ana Başlık */}
        <h1 className="text-5xl md:text-7xl font-medium text-dark mb-6 leading-tight">
          Yakında
        </h1>

        {/* Alt Başlık */}
        <p className="text-xl md:text-2xl text-dark/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Web sitemiz şu anda yapım aşamasında. 
          <br className="hidden md:block" />
          En kısa sürede sizlerle buluşacağız.
        </p>

        {/* Sosyal Medya */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="https://www.airbnb.com.tr/users/profile/1469424809008526506"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark hover:opacity-70 transition-opacity"
            aria-label="Airbnb"
          >
            <FaAirbnb size={28} />
          </a>
        </div>

        {/* Alt Not */}
        <p className="mt-12 text-sm text-dark/50">
          &copy; {new Date().getFullYear()} ASA Group. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
