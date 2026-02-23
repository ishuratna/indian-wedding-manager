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
        const botNumber = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '15551234567'; // Fallback if env variable not set
        const waLink = `https://wa.me/${botNumber}?text=${encodeURIComponent(`Hi! I am ${formData.fullName}, confirming my WhatsApp for the wedding RSVP.`)}`;

        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 font-serif">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
                    <div className="text-6xl text-rose-500">🎉</div>
                    <h2 className="text-3xl font-bold text-slate-900">{t.thankYou}</h2>
                    <p className="text-slate-600 text-lg">
                        {t.rsvpSuccess}
                    </p>

                    <div className="pt-6 border-t border-rose-100">
                        <h3 className="font-bold text-slate-900 mb-2 font-sans tracking-wide">One Last Step: Validate WhatsApp</h3>
                        <p className="text-slate-500 text-sm mb-6 font-sans">
                            To receive updates and chat with our Wedding Assistant for your travel details, please send us a quick message!
                        </p>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-green-500 text-white font-sans font-bold text-lg shadow hover:bg-green-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            Validate WhatsApp
                        </a>
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
