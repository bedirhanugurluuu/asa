"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

interface ContactProps {
  showTitle?: boolean;
}

export default function Contact({ showTitle = true }: ContactProps) {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section id="iletisim" className="bg-white">
      <div className="w-full">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.contact.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.contact.subtitle}
            </p>
          </div>
        )}

        <div className="md:p-12">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    style={{
                      strokeDasharray: 62.83,
                      strokeDashoffset: 62.83,
                      animation: "drawCircle 0.6s ease-in-out forwards",
                    }}
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 12l2 2 4-4"
                    style={{
                      strokeDasharray: 20,
                      strokeDashoffset: 20,
                      animation: "drawCheck 0.4s ease-in-out 0.3s forwards",
                    }}
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-dark mb-2">
                {t.contact.form.submit} - Mesajınız Gönderildi!
              </h3>
              <p className="text-base text-dark/70">
                Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş sağlayacağız.
              </p>
            </div>
          ) : (
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setError(null);

              const formData = new FormData(e.currentTarget);
              const data = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                message: formData.get("message") as string,
              };

              try {
                const response = await fetch("/api/contact", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });

                if (!response.ok) {
                  throw new Error("Failed to send message");
                }

                setIsSubmitted(true);
                (e.target as HTMLFormElement).reset();
              } catch (err) {
                setError("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
                console.error("Contact form error:", err);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-6"
          >
            {/* İsim ve Soyisim - Yan yana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.contact.form.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 bg-[#f7f7f7] rounded-lg border border-[#f7f7f7] focus:border focus:border-gray-400 outline-none transition-all placeholder:text-sm"
                  style={{ backgroundColor: "#f7f7f7" }}
                  placeholder={t.contact.form.firstNamePlaceholder}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.contact.form.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 bg-[#f7f7f7] rounded-lg border border-[#f7f7f7] focus:border focus:border-gray-400 outline-none transition-all placeholder:text-sm"
                  style={{ backgroundColor: "#f7f7f7" }}
                  placeholder={t.contact.form.lastNamePlaceholder}
                />
              </div>
            </div>

            {/* Email ve Phone - Yan yana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 bg-[#f7f7f7] rounded-lg border border-[#f7f7f7] focus:border focus:border-gray-400 outline-none transition-all placeholder:text-sm"
                  style={{ backgroundColor: "#f7f7f7" }}
                  placeholder={t.contact.form.emailPlaceholder}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t.contact.form.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 bg-[#f7f7f7] rounded-lg border border-[#f7f7f7] focus:border focus:border-gray-400 outline-none transition-all placeholder:text-sm"
                  style={{ backgroundColor: "#f7f7f7" }}
                  placeholder={t.contact.form.phonePlaceholder}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.contact.form.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 bg-[#f7f7f7] rounded-lg border border-[#f7f7f7] focus:border focus:border-gray-400 outline-none transition-all resize-none placeholder:text-sm"
                style={{ backgroundColor: "#f7f7f7" }}
                placeholder={t.contact.form.messagePlaceholder}
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-dark text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Gönderiliyor..." : t.contact.form.submit}
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
