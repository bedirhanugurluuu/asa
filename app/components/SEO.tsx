"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  type?: "website" | "article";
  image?: string;
}

export default function SEO({ title, description, type = "website", image }: SEOProps) {
  const pathname = usePathname();
  const currentLang = useLanguage();
  const t = translations[currentLang];

  // Base URL - production'da gerçek domain ile değiştirilmeli
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://asagroupglobal.com";
  
  // Canonical URL oluştur
  const canonicalPath = pathname === "/" ? "" : pathname;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  // Alternate language URLs
  const alternateUrls = {
    "x-default": canonicalUrl,
    "tr": pathname.startsWith("/en") ? canonicalUrl.replace("/en", "") : canonicalUrl,
    "en": pathname.startsWith("/en") ? canonicalUrl : `${baseUrl}/en${canonicalPath === "/" ? "" : canonicalPath}`,
  };

  // Default title ve description
  const pageTitle = title || t.seo?.title || "ASA Group Luxury Rent - Kısa Dönem Kiralama Yönetimi";
  const pageDescription = description || t.seo?.description || "ASA Group Luxury Rent, İngiltere, Türkiye, Yunanistan ve Dubai'de premium lokasyonlarda kısa dönem kiralama yönetimi ve gelir optimizasyonu hizmetleri sunar.";
  const pageImage = image || `${baseUrl}/images/og-image.jpg`;

  useEffect(() => {
    // Meta tags ekle/güncelle
    const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Title
    document.title = pageTitle;

    // Basic meta tags
    updateMetaTag("description", pageDescription);
    updateMetaTag("og:title", pageTitle, "property");
    updateMetaTag("og:description", pageDescription, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:image", pageImage, "property");
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", pageTitle, "name");
    updateMetaTag("twitter:description", pageDescription, "name");
    updateMetaTag("twitter:image", pageImage, "name");

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Alternate language links
    Object.entries(alternateUrls).forEach(([lang, url]) => {
      let alternateLink = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!alternateLink) {
        alternateLink = document.createElement("link");
        alternateLink.setAttribute("rel", "alternate");
        alternateLink.setAttribute("hreflang", lang);
        document.head.appendChild(alternateLink);
      }
      alternateLink.setAttribute("href", url);
    });

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "Organization",
      name: "ASA Group Luxury Rent",
      url: baseUrl,
      logo: `${baseUrl}/logos/logo.png`,
      description: pageDescription,
      ...(type === "website" && {
        sameAs: [
          // Social media links buraya eklenebilir
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["Turkish", "English"],
        },
      }),
      ...(type === "article" && {
        headline: pageTitle,
        image: pageImage,
        datePublished: new Date().toISOString(),
      }),
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLd);
  }, [pathname, currentLang, pageTitle, pageDescription, pageImage, canonicalUrl, type, baseUrl, alternateUrls]);

  return null;
}
