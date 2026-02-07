"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = useLanguage();
  const t = translations[currentLang];
  
  // Ana sayfa kontrolü
  const isHomePage = pathname === "/" || pathname === "/en";
  const bgColor = isHomePage ? "bg-white" : "bg-[#f7f5f2]";

  return (
    <footer className={`${bgColor} text-black py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-[1440px] mx-auto">
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Sol: Logo */}
          <div className="flex items-start">
            <Link href={currentLang === "en" ? "/en" : "/"} className="flex items-center">
              <Image
                src="/logos/logo.png"
                alt="ASA Logo"
                width={120}
                height={40}
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logos/asa-logo.svg";
                }}
              />
            </Link>
          </div>

          {/* Orta: Nav Linkler ve İletişim Bilgileri */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-25">
            {/* Nav Linkler */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href={currentLang === "en" ? "/en/airbnb-management" : "/airbnb-management"}
                    className="text-black hover:opacity-70 transition-opacity"
                  >
                    {t.header.nav.services}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={currentLang === "en" ? "/en/about" : "/about"}
                    className="text-black hover:opacity-70 transition-opacity"
                  >
                    {t.header.nav.about}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={currentLang === "en" ? "/en/contact" : "/contact"}
                    className="text-black hover:opacity-70 transition-opacity"
                  >
                    {t.header.nav.contact}
                  </Link>
                </li>
              </ul>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <ul className="space-y-2 text-black">
                <li className="hover:opacity-70 transition-opacity">
                  <a href="mailto:info@asa.com">info@asa.com</a>
                </li>
                <li className="hover:opacity-70 transition-opacity">
                  <a href="tel:+902121234567">+90 (212) 123 45 67</a>
                </li>
                <li>{t.contact.info.location}</li>
              </ul>
            </div>
          </div>

          {/* Sağ: Social Media Linkleri */}
          <div className="flex flex-col items-start md:items-end">
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-8 text-center">
          <p className="text-black">
            &copy; {new Date().getFullYear()} ASA. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
