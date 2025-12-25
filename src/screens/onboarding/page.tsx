import BkumentsLogo from "@/components/logo/Logo";
import Link from "next/link";
import React from "react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* --- HEADER / NAVBAR --- */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-gray-50">
        <div className="flex items-center">
          <BkumentsLogo />
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-black">
              Our Stories
            </Link>
            <Link href="#" className="hover:text-black">
              Write
            </Link>
            <Link href="/login" className="hover:text-black">
              Sign In
            </Link>
          </nav>

          <Link href="/register">
            <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">
              Human <br />
              Stories & Documents
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-serif">
              A Place To Read, Write, Connecting, Sharing Documents And Deepen
              Your Understanding
            </p>

            <div className="pt-4">
              <Link href="/login">
                <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-serif tracking-wide hover:scale-105 transition-transform duration-200">
                  Start Reading
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Graphic/Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-xl aspect-square">
              {/* 2. FIX THE SRC HERE */}
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
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider">
          <Link href="#" className="hover:text-black">
            Help
          </Link>
          <Link href="#" className="hover:text-black">
            Status
          </Link>
          <Link href="#" className="hover:text-black">
            About
          </Link>
          <Link href="#" className="hover:text-black">
            Careers
          </Link>
          <Link href="#" className="hover:text-black">
            Press
          </Link>
          <Link href="#" className="hover:text-black">
            Privacy
          </Link>
          <Link href="#" className="hover:text-black">
            Rules
          </Link>
          <Link href="#" className="hover:text-black">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
