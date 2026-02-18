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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-100">
      {/* Navigation */}
      <nav className="border-b border-rose-50 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">💍</span>
            <div className="flex flex-col -gap-1">
              <span className="font-bold text-xl tracking-wide text-rose-600 font-serif leading-none">Our Wedding</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase ml-0.5">Invitation</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
            <Link href="/rsvp?wedding=qP78RG6023gWjQ7bj9XQOfsXhIa2" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">{t.rsvpNow}</Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 sm:pt-32 sm:pb-24 px-6 text-center relative overflow-hidden min-h-[700px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/personal/couple-aerial.png"
            alt="Tanya & Ishu"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center rounded-full border border-rose-300/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-rose-200 mb-4 tracking-widest uppercase">
            ✨ {t.shareJoy}
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-white font-serif leading-tight drop-shadow-lg">
            {t.celebrating} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-amber-300">{t.newBeginning}</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-serif italic drop-shadow">
            {t.landingSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link
              href="/rsvp?wedding=qP78RG6023gWjQ7bj9XQOfsXhIa2"
              className="h-16 px-12 rounded-full bg-rose-600 text-white font-bold text-lg flex items-center justify-center hover:bg-rose-700 hover:-translate-y-1 transition-all shadow-xl shadow-rose-900/40 tracking-widest uppercase"
            >
              {t.submit}
            </Link>
          </div>
        </div>
      </section>

      {/* Story / Gallery Strip */}
      <section className="bg-white py-20 px-6 border-b border-rose-50">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 font-serif lowercase italic">{t.journeyTitle}</h2>
            <p className="text-slate-500 font-serif leading-relaxed">
              {t.journeyText}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="relative h-80 rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
              <Image src="/images/personal/family.png" alt="Family photo" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative h-80 rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white -rotate-2">
              <Image src="/images/personal/couple-walk.png" alt="Couple walking" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative h-80 rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white rotate-1">
              <Image src="/images/personal/couple-rings.png" alt="Couple rings" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-slate-50 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="text-4xl">💍</span>
          <div className="space-y-1">
            <p className="text-slate-900 font-serif text-xl font-bold tracking-widest uppercase">{t.september}</p>
            <p className="text-slate-500 font-serif italic text-lg tracking-widest">{t.newDelhi}</p>
          </div>
          <p className="text-slate-400 text-xs tracking-[0.2em] font-bold uppercase mt-8">© 2026 Crafted with love by EasyWeddings</p>
        </div>
      </footer>
    </div>
  );
}
