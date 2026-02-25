'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Guest } from '@/app/types/guest';
import { translations, Language } from '@/lib/utils/translations';
import LanguageToggle from '@/components/LanguageToggle';

export default function DetailsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-rose-50"><p className="text-rose-600 font-serif text-xl animate-pulse">Loading...</p></div>}>
            <DetailsContent />
        </Suspense>
    );
}

function DetailsContent() {
    const searchParams = useSearchParams();
    const weddingId = searchParams.get('wedding') || 'qP78RG6023gWjQ7bj9XQOfsXhIa2'; // Default planner UID

    const [lang, setLang] = useState<Language>('en');
    const t = translations[lang];

    const [phoneMode, setPhoneMode] = useState(true);
    const [phoneInput, setPhoneInput] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [fetchingPhone, setFetchingPhone] = useState(false);

    const [guest, setGuest] = useState<Guest | null>(null);
    const [guestId, setGuestId] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFetchingPhone(true);
        setPhoneError('');

        try {
            const res = await fetch(`/api/guests/by-phone?weddingId=${weddingId}&phone=${encodeURIComponent(phoneInput)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Guest not found. Please try another number.');
            }

            setGuest(data);
            setGuestId(data.id);
            setPhoneMode(false);
        } catch (err: any) {
            setPhoneError(err.message);
        } finally {
            setFetchingPhone(false);
        }
    };

    const handleFormUpdate = (field: keyof Guest, value: any) => {
        if (!guest) return;
        setGuest({ ...guest, [field]: value });
    };

    const handleNestedUpdate = (parent: 'arrival' | 'departure' | 'accommodation', field: string, value: any) => {
        if (!guest) return;
        setGuest({
            ...guest,
            [parent]: { ...(guest[parent] as any), [field]: value }
        });
    };

    const toggleArrayItem = (field: 'events' | 'dietaryRestrictions', item: string) => {
        if (!guest) return;
        const current = (guest[field] as string[]) || [];
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        setGuest({ ...guest, [field]: updated as any });
    };

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestId) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/guests/${guestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...guest,
                    registrationStage: 'DetailsComplete'
                }),
            });

            if (!res.ok) throw new Error('Failed to update details');
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted && guest) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 font-serif">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
                    <div className="text-6xl text-rose-500 animate-bounce">📋</div>
                    <h2 className="text-3xl font-bold text-slate-900">{t.detailsSaved}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        {t.detailsSuccess ? t.detailsSuccess.replace('{name}', guest.fullName.split(' ')[0]) : `Thank you, ${guest.fullName}! Your details have been saved successfully.`}
                    </p>
                    <p className="text-sm text-slate-400 italic pt-4">{t.seeYouNote}</p>
                </div>
            </div>
        );
    }

    if (phoneMode) {
        // Phone number input screen
        return (
            <div className="min-h-screen bg-rose-50 font-serif relative overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="absolute top-6 right-6 z-50">
                    <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 relative z-10 border border-rose-100 mt-[-10vh]">
                    <div className="text-center mb-8 space-y-2">
                        <div className="text-4xl text-rose-500 mb-4">✨</div>
                        <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
                            Welcoming You to #Ishanya
                        </h1>
                        <p className="text-zinc-500 font-sans text-sm">
                            Please enter your registered phone number to continue.
                        </p>
                    </div>

                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                        {phoneError && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm font-sans">
                                {phoneError}
                            </div>
                        )}
                        <div>
                            <input
                                type="tel"
                                required
                                placeholder="e.g. 9876543210"
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 rounded-xl py-4 px-5 text-lg transition-all font-sans text-center"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={fetchingPhone || !phoneInput.trim()}
                            className={`w-full py-4 rounded-xl bg-slate-900 text-white font-sans font-bold text-lg tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all ${fetchingPhone || !phoneInput.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-black'}`}
                        >
                            {fetchingPhone ? 'Searching...' : 'Continue'}
                        </button>
                    </form>
                </div>
                <div className="mt-8 relative z-10 text-center text-slate-400 text-sm italic tracking-widest">
                    Made with ❤️ by EasyWeddings
                </div>
            </div >
        );
    }

    if (!guest) return null;

    // Actual details form
    return (
        <div className="min-h-screen bg-rose-50 font-serif py-12 px-6 relative overflow-hidden">
            <div className="absolute top-6 right-6 z-50">
                <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Namaste, {guest.fullName.split(' ')[0]}! 🙏<br />
                        We are excited to welcome you to #Ishanya
                    </h1>
                    <p className="text-slate-500 font-sans pt-2">
                        {t.detailsSubtitle || "Please finalize your details below"}
                    </p>
                </div>

                <form onSubmit={handleSubmitDetails} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-rose-100">
                    <div className="p-8 md:p-12 space-y-12">

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-sans mb-6">
                                {error}
                            </div>
                        )}

                        {/* 0. RSVP & Headcount Calibration */}
                        <section className="space-y-8 pb-8 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">✓</span>
                                Attendance Confirmation
                            </h2>
                            <div>
                                <label className="block text-sm font-sans font-bold text-slate-700 mb-4">{t.attendingQuestion || "Will you be attending?"}</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'Confirmed', label: t.yes || 'Yes', icon: '✨' },
                                        { id: 'Declined', label: t.no || 'No', icon: '🙏' },
                                        { id: 'Tentative', label: t.maybe || 'Maybe', icon: '🤔' }
                                    ].map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => handleFormUpdate('rsvpStatus', option.id as any)}
                                            className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${guest.rsvpStatus === option.id
                                                ? 'border-rose-500 bg-rose-50 shadow-inner'
                                                : 'border-slate-100 hover:border-rose-200 text-slate-500'
                                                }`}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            <span className="font-sans font-bold text-sm tracking-widest uppercase">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(guest.rsvpStatus === 'Confirmed' || guest.rsvpStatus === 'Tentative') && (
                                <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-sm font-sans font-bold text-slate-700 mb-6">{t.guestCount || "Number of Guests"}</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        {[
                                            { id: 'adults', label: t.adults || 'Adults', sub: t.adultsAge || '12+ Years' },
                                            { id: 'kids', label: t.kids || 'Kids', sub: t.kidsAge || '2-12 Years' },
                                            { id: 'infants', label: t.infants || 'Infants', sub: t.infantsAge || '0-2 Years' }
                                        ].map(type => (
                                            <div key={type.id} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="text-center">
                                                    <p className="font-bold text-slate-900 text-sm">{type.label}</p>
                                                    <p className="text-[10px] text-slate-400 font-sans tracking-wide uppercase">{type.sub}</p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFormUpdate(type.id as any, Math.max(0, (guest[type.id as keyof Guest] as number || 0) - 1))}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all font-bold"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-4 text-center text-lg font-bold font-sans">
                                                        {guest[type.id as keyof Guest] as number || 0}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFormUpdate(type.id as any, (guest[type.id as keyof Guest] as number || 0) + 1)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                        {guest.rsvpStatus !== 'Declined' && (
                            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                                {/* 1. Dining Preferences */}
                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                        {t.diningHeader}
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { id: 'Veg', label: t.veg },
                                            { id: 'Non-Veg', label: t.nonVeg },
                                            { id: 'Jain', label: t.jain },
                                            { id: 'Vegan', label: t.vegan }
                                        ].map(diet => (
                                            <button
                                                key={diet.id}
                                                type="button"
                                                onClick={() => toggleArrayItem('dietaryRestrictions', diet.id)}
                                                className={`px-6 py-3 rounded-xl border-2 transition-all font-sans font-bold text-sm tracking-widest ${guest.dietaryRestrictions?.includes(diet.id as any)
                                                    ? 'bg-rose-50 border-rose-500 text-rose-600'
                                                    : 'border-slate-100 text-slate-400 hover:border-rose-200'
                                                    }`}
                                            >
                                                {diet.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t.diningPlaceholder || "Any Allergies? (e.g. Peanuts, Gluten)"}
                                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 rounded-xl py-4 px-5 text-sm transition-all font-sans"
                                        value={guest.allergies || ''}
                                        onChange={(e) => handleFormUpdate('allergies', e.target.value)}
                                    />
                                </section>

                                {/* 2. Events Attendance */}
                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                        {t.eventsHeader}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'].map(event => (
                                            <label key={event} className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${guest.events?.includes(event) ? 'bg-rose-50 border-rose-500' : 'border-slate-100 hover:border-rose-200'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                    checked={guest.events?.includes(event)}
                                                    onChange={() => toggleArrayItem('events', event)}
                                                />
                                                <span className="font-sans font-bold text-slate-700 tracking-wide">{event.toUpperCase()}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. Travel & Accommodation */}
                                <section className="space-y-8">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                        {t.travelHeader}
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        {/* Arrival */}
                                        <div className="space-y-4">
                                            <p className="font-bold text-slate-600 text-sm tracking-widest uppercase">{t.arrivalVenue}</p>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl py-3 px-4 font-sans text-sm"
                                                value={guest.arrival?.date || ''}
                                                onChange={(e) => handleNestedUpdate('arrival', 'date', e.target.value)}
                                            />
                                            <input
                                                type="time"
                                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl py-3 px-4 font-sans text-sm"
                                                value={guest.arrival?.time || ''}
                                                onChange={(e) => handleNestedUpdate('arrival', 'time', e.target.value)}
                                            />
                                            <select
                                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl py-3 px-4 font-sans text-sm"
                                                value={guest.arrival?.mode || 'Flight'}
                                                onChange={(e) => handleNestedUpdate('arrival', 'mode', e.target.value)}
                                            >
                                                <option value="Flight">Flight</option>
                                                <option value="Train">Train</option>
                                                <option value="Car">Car</option>
                                                <option value="Bus">Bus</option>
                                            </select>
                                        </div>

                                        {/* Accommodation */}
                                        <div className="space-y-4">
                                            <p className="font-bold text-slate-600 text-sm tracking-widest uppercase">{t.stayPreference}</p>
                                            <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${guest.accommodation?.isRequired ? 'bg-rose-50 border-rose-500' : 'border-slate-100 hover:border-rose-200'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                    checked={guest.accommodation?.isRequired}
                                                    onChange={(e) => handleNestedUpdate('accommodation', 'isRequired', e.target.checked)}
                                                />
                                                <span className="font-sans font-bold text-slate-700 tracking-wide">{t.needAccommodation}</span>
                                            </label>
                                            {guest.accommodation?.isRequired && (
                                                <div className="flex items-center justify-between p-2">
                                                    <span className="text-sm font-sans text-slate-500 uppercase font-bold">{t.roomsNeeded || "Rooms"}:</span>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleNestedUpdate('accommodation', 'roomsNeeded', Math.max(0, (guest.accommodation?.roomsNeeded || 0) - 1))}
                                                            className="w-8 h-8 rounded-full border border-slate-200 text-slate-400"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-4 text-center font-sans font-bold">
                                                            {guest.accommodation?.roomsNeeded || 0}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleNestedUpdate('accommodation', 'roomsNeeded', (guest.accommodation?.roomsNeeded || 0) + 1)}
                                                            className="w-8 h-8 rounded-full border border-slate-200 text-slate-400"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        <div className="pt-8 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-5 rounded-2xl bg-slate-900 text-white font-sans font-bold text-lg tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-black'
                                    }`}
                            >
                                {submitting ? t.saving : t.finalizeDetails}
                            </button>
                        </div >
                    </div >
                </form >
            </div >
        </div >
    );
}
