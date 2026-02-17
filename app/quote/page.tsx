"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { useLanguage } from "@/lib/useLanguage";
import { translations } from "@/lib/translations";

async function searchCity(query: string) {
  if (!query || query.length < 2) return { features: [] };
  
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`
  );

  return await res.json();
}

interface AddressSuggestion {
  properties: {
    formatted: string;
    city?: string;
    country?: string;
  };
}

export default function QuotePage() {
  const currentLang = useLanguage();
  const t = translations[currentLang];
  const months = t.quote.propertyTab.months;
  const bedroomOptions = t.quote.propertyTab.bedroomOptions;
  
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  
  // Field refs for scrolling to errors
  const bedroomsRef = useRef<HTMLSelectElement>(null);
  const maxGuestsRef = useRef<HTMLDivElement>(null);
  const monthsRef = useRef<HTMLDivElement>(null);
  const isOwnerRef = useRef<HTMLDivElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [address, setAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  
  // Personal info form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  
  // Validation errors
  const [errors, setErrors] = useState({
    address: false,
    bedrooms: false,
    maxGuests: false,
    months: false,
    isOwner: false,
    fullName: false,
    email: false,
    phone: false,
  });

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Check if property tab is completed
  const isPropertyTabCompleted = () => {
    return (
      address.trim() !== "" &&
      selectedBedrooms !== "" &&
      maxGuests >= 1 &&
      selectedMonths.length > 0 &&
      isOwner !== null
    );
  };

  // Debounced search for address autocomplete
  useEffect(() => {
    if (addressQuery.length < 2) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchCity(addressQuery);
        const features = (data.features || []) as AddressSuggestion[];
        setAddressSuggestions(features);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Address search error:", error);
        setAddressSuggestions([]);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [addressQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const selectedAddress = suggestion.properties.formatted;
    setAddress(selectedAddress);
    setAddressQuery(selectedAddress);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Clear suggestions to prevent them from showing again on focus
    setAddressSuggestions([]);
    setIsAddressSelected(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || addressSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < addressSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < addressSuggestions.length) {
          handleAddressSelect(addressSuggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectAllMonths = () => {
    if (selectedMonths.length === months.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths([...months]);
    }
  };

  const handleMonthToggle = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const scrollToFirstError = (errorObj: {
    address: boolean;
    bedrooms: boolean;
    maxGuests: boolean;
    months: boolean;
    isOwner: boolean;
    fullName: boolean;
    email: boolean;
    phone: boolean;
  }) => {
    // Priority order for scrolling
    const errorFields = [
      { key: 'address' as const, ref: addressInputRef },
      { key: 'bedrooms' as const, ref: bedroomsRef },
      { key: 'maxGuests' as const, ref: maxGuestsRef },
      { key: 'months' as const, ref: monthsRef },
      { key: 'isOwner' as const, ref: isOwnerRef },
      { key: 'fullName' as const, ref: fullNameRef },
      { key: 'email' as const, ref: emailRef },
      { key: 'phone' as const, ref: phoneRef },
    ];

    for (const field of errorFields) {
      if (errorObj[field.key] && field.ref.current) {
        setTimeout(() => {
          field.ref.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
        break;
      }
    }
  };

  const handleNext = () => {
    // Validation
    const newErrors = {
      address: !address || address.trim() === "",
      bedrooms: !selectedBedrooms || selectedBedrooms === "",
      maxGuests: maxGuests < 1,
      months: selectedMonths.length === 0,
      isOwner: isOwner === null,
      fullName: false,
      email: false,
      phone: false,
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      scrollToFirstError(newErrors);
      return;
    }

    setActiveTab(2);
    
    // Scroll to top of tab content when switching to tab 2
    setTimeout(() => {
      tabContentRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleTabChange = (tab: 1 | 2) => {
    // Prevent switching to personal info tab if property tab is not completed
    if (tab === 2 && !isPropertyTabCompleted()) {
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for personal info
    const newErrors = {
      ...errors,
      fullName: !fullName || fullName.trim() === "",
      email: !email || email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      phone: !phone || phone.trim() === "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      scrollToFirstError(newErrors);
      return;
    }

    // Prepare form data
    const formData = {
      // Property info
      address,
      bedrooms: selectedBedrooms,
      maxGuests,
      selectedMonths,
      isOwner,
      // Personal info
      fullName,
      email,
      phone,
      company,
      message,
    };

    // TODO: Send email with form data
    console.log("Form Data:", formData);
    
    // Show success message
    setIsSubmitted(true);
    
    // Scroll to success message
    setTimeout(() => {
      successMessageRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Sol: Görsel ve Yazı */}
            <div className="w-full">
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative mb-6">
                <Image
                  src="/images/hero-image.png"
                  alt="ASA Group"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-dark leading-tight mb-4 w-full">
                {t.quote.title}
              </h2>
              <div className="text-base md:text-lg text-dark/70 leading-relaxed w-full mt-6">
                {Array.isArray(t.quote.description) ? (
                  t.quote.description.map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-4" : ""}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{t.quote.description}</p>
                )}
              </div>
            </div>

            {/* Sağ: Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 w-full min-h-[400px]">
              {/* Tab Navigation */}
              {!isSubmitted && (
                <div className="flex gap-4 mb-8 pb-4 border-b border-gray-200">
                  <button
                    onClick={() => handleTabChange(1)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 1
                        ? "text-dark border-b-2 border-dark"
                        : "text-dark/60 hover:text-dark"
                    }`}
                  >
                    {t.quote.tabs.property}
                  </button>
                  <button
                    onClick={() => handleTabChange(2)}
                    disabled={!isPropertyTabCompleted()}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 2
                        ? "text-dark border-b-2 border-dark"
                        : !isPropertyTabCompleted()
                        ? "text-dark/30 cursor-not-allowed"
                        : "text-dark/60 hover:text-dark"
                    }`}
                  >
                    {t.quote.tabs.personal}
                  </button>
                </div>
              )}

              {/* Success Message */}
              {isSubmitted && (
                <div 
                  ref={successMessageRef}
                  className="flex flex-col items-center justify-center py-12 px-6 text-center min-h-[400px]"
                >
                  {/* Animated Checkmark */}
                  <div className="mb-6">
                    <svg
                      className="w-20 h-20 text-green-500"
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
                  
                  {/* Success Message */}
                  <h3 
                    className="text-2xl md:text-3xl font-medium text-dark mb-3"
                    style={{
                      animation: "fadeInUp 0.5s ease-out 0.6s forwards",
                      opacity: 0,
                      transform: "translateY(20px)",
                    }}
                  >
                    {t.quote.success.title}
                  </h3>
                  <p 
                    className="text-base text-dark/70 max-w-md"
                    style={{
                      animation: "fadeInUp 0.5s ease-out 0.8s forwards",
                      opacity: 0,
                      transform: "translateY(20px)",
                    }}
                  >
                    {t.quote.success.message}
                  </p>
                </div>
              )}
              
              {/* Tab Content */}
              {!isSubmitted && (
                <div ref={tabContentRef}>
                  {activeTab === 1 && (
                    <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-medium text-dark mb-2">
                      {t.quote.propertyTab.title}
                    </h3>
                    <p className="text-base text-dark/70">
                      {t.quote.propertyTab.subtitle}
                    </p>
                  </div>

                  {/* Adres Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.propertyTab.address}
                    </label>
                    <input
                      ref={addressInputRef}
                      type="text"
                      value={addressQuery}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setAddressQuery(newValue);
                        setAddress(newValue);
                        setSelectedIndex(-1);
                        setIsAddressSelected(false); // User is typing, so address is not selected anymore
                        if (errors.address) {
                          setErrors((prev) => ({ ...prev, address: false }));
                        }
                      }}
                      onFocus={() => {
                        // Only show suggestions if:
                        // 1. User is actively typing (query length >= 2)
                        // 2. There are suggestions available
                        // 3. Address was not already selected (to prevent showing same suggestions again)
                        if (addressQuery.length >= 2 && addressSuggestions.length > 0 && !isAddressSelected) {
                          setShowSuggestions(true);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={t.quote.propertyTab.addressPlaceholder}
                      autoComplete="off"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      id="address-input"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                    )}
                    {/* Suggestions Dropdown */}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddressSelect(suggestion)}
                            className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 last:border-b-0 ${
                              selectedIndex === index
                                ? "bg-dark text-white"
                                : "hover:bg-gray-100 text-dark"
                            }`}
                          >
                            <div className="font-medium">
                              {suggestion.properties.formatted}
                            </div>
                            {suggestion.properties.city && (
                              <div className={`text-sm ${
                                selectedIndex === index ? "text-white/80" : "text-dark/60"
                              }`}>
                                {suggestion.properties.city}
                                {suggestion.properties.country && `, ${suggestion.properties.country}`}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Oda Sayısı ve Maksimum Konuk */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Oda Sayısı */}
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {t.quote.propertyTab.bedrooms}
                      </label>
                      <div className="relative">
                        <select
                          ref={bedroomsRef}
                          value={selectedBedrooms}
                          onChange={(e) => {
                            setSelectedBedrooms(e.target.value);
                            if (errors.bedrooms) {
                              setErrors((prev) => ({ ...prev, bedrooms: false }));
                            }
                          }}
                          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent appearance-none bg-white cursor-pointer custom-select ${
                            errors.bedrooms ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">{t.quote.propertyTab.bedroomsSelect}</option>
                          {bedroomOptions.map((bedroom) => (
                            <option key={bedroom} value={bedroom}>
                              {bedroom}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-dark"
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
                        </div>
                      </div>
                      {errors.bedrooms && (
                        <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                      )}
                    </div>

                    {/* Maksimum Konuk Sayısı */}
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {t.quote.propertyTab.maxGuests}
                      </label>
                      <div 
                        ref={maxGuestsRef}
                        className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-dark focus-within:border-transparent ${
                          errors.maxGuests ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = Math.max(1, maxGuests - 1);
                            setMaxGuests(newValue);
                            if (errors.maxGuests && newValue >= 1) {
                              setErrors((prev) => ({ ...prev, maxGuests: false }));
                            }
                          }}
                          className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-300 text-dark font-medium"
                          aria-label={t.quote.ariaLabels.decrease}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={maxGuests}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setMaxGuests(value);
                            if (errors.maxGuests && value >= 1) {
                              setErrors((prev) => ({ ...prev, maxGuests: false }));
                            }
                          }}
                          className="w-full px-4 py-3 text-center border-0 focus:outline-none focus:ring-0 bg-white text-dark"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMaxGuests(maxGuests + 1);
                            if (errors.maxGuests) {
                              setErrors((prev) => ({ ...prev, maxGuests: false }));
                            }
                          }}
                          className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-l border-gray-300 text-dark font-medium"
                          aria-label={t.quote.ariaLabels.increase}
                        >
                          +
                        </button>
                      </div>
                      {errors.maxGuests && (
                        <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                      )}
                    </div>
                  </div>

                  {/* Aylar Seçimi */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">
                      {t.quote.propertyTab.monthsLabel}
                    </label>
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={handleSelectAllMonths}
                        className="text-sm text-dark/70 hover:text-dark underline"
                      >
                        {selectedMonths.length === months.length ? t.quote.propertyTab.deselectAll : t.quote.propertyTab.selectAll}
                      </button>
                    </div>
                    <div 
                      ref={monthsRef}
                      className={`grid grid-cols-3 md:grid-cols-4 gap-2 p-2 rounded-lg ${
                        errors.months ? "border border-red-500" : ""
                      }`}
                    >
                      {months.map((month) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => {
                            handleMonthToggle(month);
                            if (errors.months) {
                              setErrors((prev) => ({ ...prev, months: false }));
                            }
                          }}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            selectedMonths.includes(month)
                              ? "bg-dark text-white border-dark"
                              : "bg-white text-dark border-gray-300 hover:border-dark"
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                    {errors.months && (
                      <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                    )}
                  </div>

                  {/* Mülk Sahibi Sorusu */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">
                      {t.quote.propertyTab.ownerQuestion}
                    </label>
                    <div ref={isOwnerRef} className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOwner(true);
                          if (errors.isOwner) {
                            setErrors((prev) => ({ ...prev, isOwner: false }));
                          }
                        }}
                        className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                          isOwner === true
                            ? "bg-dark text-white border-dark"
                            : errors.isOwner
                            ? "bg-white text-dark border-red-500"
                            : "bg-white text-dark border-gray-300 hover:border-dark"
                        }`}
                      >
                        {t.quote.propertyTab.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOwner(false);
                          if (errors.isOwner) {
                            setErrors((prev) => ({ ...prev, isOwner: false }));
                          }
                        }}
                        className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                          isOwner === false
                            ? "bg-dark text-white border-dark"
                            : errors.isOwner
                            ? "bg-white text-dark border-red-500"
                            : "bg-white text-dark border-gray-300 hover:border-dark"
                        }`}
                      >
                        {t.quote.propertyTab.no}
                      </button>
                    </div>
                    {errors.isOwner && (
                      <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                    )}
                  </div>

                  {/* İleri Butonu */}
                  <button
                    onClick={handleNext}
                    className="w-full px-6 py-3 bg-dark text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    {t.quote.propertyTab.next}
                  </button>
                </div>
              )}

                  {activeTab === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-medium text-dark mb-2">
                      {t.quote.personalTab.title}
                    </h3>
                    <p className="text-base text-dark/70">
                      {t.quote.personalTab.subtitle}
                    </p>
                  </div>

                  {/* Ad Soyad */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.personalTab.fullName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={fullNameRef}
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) {
                          setErrors((prev) => ({ ...prev, fullName: false }));
                        }
                      }}
                      placeholder={t.quote.personalTab.fullNamePlaceholder}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                    )}
                  </div>

                  {/* E-posta */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.personalTab.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: false }));
                        }
                      }}
                      placeholder={t.quote.personalTab.emailPlaceholder}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                          ? t.quote.errors.invalidEmail
                          : t.quote.errors.required}
                      </p>
                    )}
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.personalTab.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: false }));
                        }
                      }}
                      placeholder={t.quote.personalTab.phonePlaceholder}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{t.quote.errors.required}</p>
                    )}
                  </div>

                  {/* Şirket (Opsiyonel) */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.personalTab.company}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t.quote.personalTab.companyPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent"
                    />
                  </div>

                  {/* Mesaj (Opsiyonel) */}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t.quote.personalTab.message}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.quote.personalTab.messagePlaceholder}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Gönder Butonu */}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-dark text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    {t.quote.personalTab.submit}
                  </button>
                </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
