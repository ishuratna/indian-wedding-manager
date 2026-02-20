'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { translations, Language } from '@/lib/utils/translations';
import LanguageToggle from '@/components/LanguageToggle';

export default function RSVPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-rose-50"><p className="text-rose-600 font-serif text-xl animate-pulse">Loading Invitation...</p></div>}>
            <RSVPContent />
        </Suspense>
    );
}

function RSVPContent() {
    const searchParams = useSearchParams();
    const [lang, setLang] = useState<Language>('en');
    const t = translations[lang];

    // In a production environment, this would be a custom slug or a fixed ID per deployment.
    // We use the planner's production UID as the default to ensure correct linkage.
    const weddingId = searchParams.get('wedding') || 'qP78RG6023gWjQ7bj9XQOfsXhIa2';

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        adults: 1,
        kids: 0,
        infants: 0,
        rsvpStatus: 'Confirmed' as 'Confirmed' | 'Declined' | 'Tentative'
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Pre-fill from URL parameters
    useState(() => {
        if (typeof window !== 'undefined') {
            const name = searchParams.get('name');
            const phone = searchParams.get('phone');
            if (name || phone) {
                setFormData(prev => ({
                    ...prev,
                    fullName: name || prev.fullName,
                    phone: phone || prev.phone
                }));
            }
        }
    });

    const handleHeadcountChange = (field: 'adults' | 'kids' | 'infants', delta: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    weddingId,
                    registrationStage: 'RSVP'
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 font-serif">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
                    <div className="text-6xl text-rose-500 animate-bounce">💍</div>
                    <h2 className="text-3xl font-bold text-slate-900">{t.thankYou}</h2>
                    <p className="text-slate-600 text-lg">
                        {t.rsvpSuccess}
                    </p>
                    <div className="pt-4">
                        <p className="text-sm text-slate-400">
                            {t.rsvpWhatsAppNote}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 font-serif relative overflow-hidden">
            {/* Header / Language Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="max-w-2xl mx-auto pt-16 pb-24 px-6 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-semibold tracking-widest uppercase">
                        {t.saveTheDate}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        {t.rsvpTitle}
                    </h1>
                    <p className="text-xl text-slate-600 font-sans italic">
                        {t.rsvpSubtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 space-y-10 border border-rose-100">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-sans">
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-sans font-bold text-slate-700 mb-2">{t.fullName}</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder={t.fullNamePlaceholder}
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 rounded-xl py-4 px-5 text-lg transition-all font-sans"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-sans font-bold text-slate-700 mb-2">{t.whatsappNumber}</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder={t.phonePlaceholder}
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 rounded-xl py-4 px-5 text-lg transition-all font-sans"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Attendance */}
                    <div>
                        <label className="block text-sm font-sans font-bold text-slate-700 mb-4">{t.attendingQuestion}</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'Confirmed', label: t.yes, icon: '✨' },
                                { id: 'Declined', label: t.no, icon: '🙏' },
                                { id: 'Tentative', label: t.maybe, icon: '🤔' }
                            ].map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, rsvpStatus: option.id as any }))}
                                    className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.rsvpStatus === option.id
                                        ? 'border-rose-500 bg-rose-50 shadow-inner'
                                        : 'border-slate-100 hover:border-rose-200 text-slate-500'
                                        }`}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    <span className="font-sans font-bold text-sm tracking-widest">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Headcount - Conditional */}
                    {(formData.rsvpStatus === 'Confirmed' || formData.rsvpStatus === 'Tentative') && (
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-sm font-sans font-bold text-slate-700 mb-6">{t.guestCount}</label>
                            <div className="space-y-6">
                                {[
                                    { id: 'adults', label: t.adults, sub: t.adultsAge },
                                    { id: 'kids', label: t.kids, sub: t.kidsAge },
                                    { id: 'infants', label: t.infants, sub: t.infantsAge }
                                ].map(type => (
                                    <div key={type.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-900">{type.label}</p>
                                            <p className="text-xs text-slate-400 font-sans tracking-wide uppercase">{type.sub}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                type="button"
                                                onClick={() => handleHeadcountChange(type.id as any, -1)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-500 hover:border-rose-500 transition-all text-xl"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center text-xl font-bold font-sans">
                                                {formData[type.id as keyof typeof formData]}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleHeadcountChange(type.id as any, 1)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-rose-500 hover:border-rose-500 transition-all text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-5 rounded-2xl bg-slate-900 text-white font-sans font-bold text-lg tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-black'
                                }`}
                        >
                            {submitting ? t.processing : t.submit}
                        </button>
                    </div>
                </form>

                <div className="mt-12 text-center text-slate-400 text-sm italic tracking-widest">
                    Made with ❤️ by EasyWeddings
                </div>
            </div>
        </div>
    );
}
