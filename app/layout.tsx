import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ASA Group Luxury Rent - Kısa Dönem Kiralama Yönetimi",
  description: "ASA Group Luxury Rent, İngiltere, Türkiye, Yunanistan ve Dubai'de premium lokasyonlarda kısa dönem kiralama yönetimi ve gelir optimizasyonu hizmetleri sunar.",
  keywords: "kısa dönem kiralama, Airbnb yönetimi, mülk yönetimi, gelir optimizasyonu, luxury rental, property management",
  verification: {
    google: "mKP4ixbvZ92Fka1D-otkgNU1kd1FAooBVjS3IjektLo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    siteName: "ASA Group Luxury Rent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${figtree.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LV9ZKJ8R1T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LV9ZKJ8R1T');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
