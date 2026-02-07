"use client";

import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

interface ContactProps {
  showTitle?: boolean;
}

export default function Contact({ showTitle = true }: ContactProps) {
  const currentLang = useLanguage();
  const t = translations[currentLang];

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

        <div className="p-8 md:p-12">
          <form className="space-y-6">
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

            {/* Send Button */}
            <button
              type="submit"
              className="w-full bg-dark text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-dark/80 transition-colors"
            >
              {t.contact.form.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
