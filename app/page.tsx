'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { translations, Language } from '@/lib/utils/translations';
import LanguageToggle from '@/components/LanguageToggle';

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-slate-900 selection:bg-rose-200">
      {/* Navigation */}
      <nav className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🌸</span>
            <div className="flex flex-col -gap-1">
              <span className="font-bold text-2xl tracking-tighter text-rose-500 font-serif leading-none italic">#Ishanya</span>
              <span className="text-[9px] text-rose-400 font-bold tracking-[0.3em] uppercase ml-0.5">Wedding Invitation</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
            <Link href="/rsvp?wedding=qP78RG6023gWjQ7bj9XQOfsXhIa2" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">{t.rsvpNow}</Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-rose-300 hover:text-rose-400 transition-all uppercase tracking-widest"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 sm:pt-32 sm:pb-24 px-6 text-center relative overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/personal/couple-aerial.png"
            alt="Tanya & Ishu"
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced Pink Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-900/60 via-rose-900/40 to-[#FFF0F5] z-[1]"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="inline-flex items-center rounded-full border border-rose-200/50 bg-white/20 backdrop-blur-md px-6 py-2 text-sm font-bold text-white mb-4 tracking-[0.4em] uppercase shadow-lg">
            ✨ {t.shareJoy}
          </div>
          <h1 className="text-7xl sm:text-9xl font-bold tracking-tight text-white font-serif leading-tight drop-shadow-2xl">
            {t.celebrating} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-rose-200 to-white italic font-light">{t.newBeginning}</span>
          </h1>
          <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-serif italic drop-shadow-md">
            "{t.landingSubtitle}"
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <Link
              href="/rsvp?wedding=qP78RG6023gWjQ7bj9XQOfsXhIa2"
              className="h-20 px-16 rounded-full bg-rose-500 text-white font-bold text-xl flex items-center justify-center hover:bg-rose-600 hover:-translate-y-2 transition-all shadow-2xl shadow-rose-900/50 tracking-[0.2em] uppercase group"
            >
              {t.submit}
              <span className="ml-3 group-hover:translate-x-2 transition-transform">🌸</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-[#FFF0F5] border-y border-rose-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex justify-around items-center">
          <span className="text-9xl">🌸</span>
          <span className="text-9xl">💍</span>
          <span className="text-9xl">🌸</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-rose-400 font-bold tracking-[0.3em] uppercase text-sm mb-10">Counting down to forever</h3>
          <div className="flex justify-center gap-4 sm:gap-12">
            {[
              { label: 'Days', value: '121' },
              { label: 'Hours', value: '14' },
              { label: 'Mins', value: '32' },
              { label: 'Secs', value: '45' }
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-3 border-2 border-rose-50 transform hover:scale-110 transition-transform">
                  <span className="text-3xl sm:text-5xl font-bold text-rose-500 font-serif">{item.value}</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Gallery Strip */}
      <section className="bg-white py-32 px-6 relative">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-block w-20 h-1 bg-rose-100 mb-4 rounded-full"></div>
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 font-serif italic tracking-tight">{t.journeyTitle}</h2>
            <p className="text-xl text-slate-500 font-serif leading-loose italic px-4">
              {t.journeyText}
            </p>
            <div className="inline-block w-20 h-1 bg-rose-100 mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(251,113,133,0.3)] group border-8 border-white transform hover:-rotate-2 transition-all duration-700">
              <Image src="/images/personal/family.png" alt="Family photo" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(251,113,133,0.3)] group border-8 border-white transform hover:translate-y-12 transition-all duration-700">
              <Image src="/images/personal/couple-walk.png" alt="Couple walking" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(251,113,133,0.3)] group border-8 border-white transform hover:rotate-2 transition-all duration-700">
              <Image src="/images/personal/couple-rings.png" alt="Couple rings" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 bg-[#FFF0F5] text-center border-t border-rose-100">
        <div className="flex flex-col items-center gap-10">
          <span className="text-5xl animate-bounce">💍</span>
          <div className="space-y-4">
            <h3 className="text-rose-500 font-serif text-3xl font-bold italic tracking-tighter">#Ishanya</h3>
            <div className="space-y-1">
              <p className="text-slate-900 font-serif text-2xl font-bold tracking-[0.2em]">{t.september}</p>
              <p className="text-rose-400 font-serif italic text-xl tracking-[0.15em]">{t.newDelhi}</p>
            </div>
          </div>
          <p className="text-rose-300 text-[10px] tracking-[0.4em] font-bold uppercase mt-12 opacity-80">Handcrafted with love for Tanya & Ishu</p>
        </div>
      </footer>
    </div>
  );
}
