"use client";
import BkumentsLogo from "@/components/logo/Logo";
import { AppRoute } from "@/lib/appRoutes";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function OnboardingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* --- HEADER / NAVBAR --- */}
      <header className="flex items-center justify-between px-4 py-4 md:px-12 border-b border-gray-50">
        <div className="flex items-center shrink-0">
          <BkumentsLogo />
        </div>

        {/* [SỬA]: Giảm gap trên mobile để tránh bị chật chội */}
        <div className="flex items-center gap-3 md:gap-8">
          {/* Các link text (Stories, Write) vẫn ẩn trên mobile để có chỗ cho nút Sign In/Up */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-black">
              {t("onboarding.ourStories")}
            </Link>
            <Link href="#" className="hover:text-black">
              {t("onboarding.write")}
            </Link>
          </nav>

          {/* [SỬA]: Đưa link Sign In ra khỏi thẻ nav bị hidden. Cho nó luôn hiển thị. */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={AppRoute.login}
              className="text-sm font-medium text-gray-600 hover:text-black whitespace-nowrap"
            >
              {t("onboarding.signIn")}
            </Link>

            <Link href={AppRoute.register}>
              {/* [SỬA]: Giảm padding px/py xíu trên mobile để nút không bị quá to */}
              <button className="bg-black text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
                {t("onboarding.signUp")}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              {t("onboarding.title")}
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-serif">
              {t("onboarding.subtitle")}
            </p>

            <div className="pt-4">
              <Link href={AppRoute.login}>
                <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-serif tracking-wide hover:scale-105 transition-transform duration-200">
                  {t("onboarding.startReading")}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Graphic/Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-xl aspect-square">
              <img
                src="/svgs/login_background.svg"
                alt="Artistic illustration"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 border-t border-gray-50 mt-auto">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider px-4">
          <Link href="#" className="hover:text-black">
            {t("layout.footer.help")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.status")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.about")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.careers")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.press")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.privacy")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.rules")}
          </Link>
          <Link href="#" className="hover:text-black">
            {t("layout.footer.terms")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
