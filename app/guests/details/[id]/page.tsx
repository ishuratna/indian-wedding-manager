'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Guest } from '@/app/types/guest';

export default function GuestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const guestId = params.id as string;

    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (guestId) {
            fetch(`/api/guests/${guestId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setGuest(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Unable to load guest details. Please verify the link.');
                    setLoading(false);
                });
        }
    }, [guestId]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-rose-600 font-serif text-lg">Preparing your Personalized Form...</p>
                </div>
            </div>
        );
    }

    if (error || !guest) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
                    <p className="text-red-500 text-lg font-bold mb-4">Error</p>
                    <p className="text-slate-600 mb-6">{error || 'Guest not found'}</p>
                    <button onClick={() => router.push('/')} className="text-rose-600 font-bold hover:underline">Return Home</button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 font-serif">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
                    <div className="text-6xl text-rose-500 animate-bounce">📋</div>
                    <h2 className="text-3xl font-bold text-slate-900">Details Saved</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Thank you for sharing your travel and preference details, <strong>{guest.fullName}</strong>. We've updated our records!
                    </p>
                    <p className="text-sm text-slate-400 italic pt-4">See you at the wedding!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 font-serif py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Almost There, {guest.fullName.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500 font-sans">
                        Help us make your stay comfortable by providing a few more details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-rose-100">
                    <div className="p-8 md:p-12 space-y-12">

                        {/* 1. Dining Preferences */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                DINING PREFERENCES
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {['Veg', 'Non-Veg', 'Jain', 'Vegan'].map(diet => (
                                    <button
                                        key={diet}
                                        type="button"
                                        onClick={() => toggleArrayItem('dietaryRestrictions', diet as any)}
                                        className={`px-6 py-3 rounded-xl border-2 transition-all font-sans font-bold text-sm tracking-widest ${guest.dietaryRestrictions?.includes(diet as any)
                                                ? 'bg-rose-50 border-rose-500 text-rose-600'
                                                : 'border-slate-100 text-slate-400 hover:border-rose-200'
                                            }`}
                                    >
                                        {diet.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Any specific allergies? (e.g. Peanuts, Gluten)"
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 rounded-xl py-4 px-5 text-sm transition-all font-sans"
                                value={guest.allergies || ''}
                                onChange={(e) => handleFormUpdate('allergies', e.target.value)}
                            />
                        </section>

                        {/* 2. Events Attendance */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                EVENTS ATTENDING
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
                                TRAVEL & LOGISTICS
                            </h2>

                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Arrival */}
                                <div className="space-y-4">
                                    <p className="font-bold text-slate-600 text-sm tracking-widest uppercase">Arrival at Venue</p>
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
                                    <p className="font-bold text-slate-600 text-sm tracking-widest uppercase">Stay Preference</p>
                                    <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${guest.accommodation?.isRequired ? 'bg-rose-50 border-rose-500' : 'border-slate-100 hover:border-rose-200'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                            checked={guest.accommodation?.isRequired}
                                            onChange={(e) => handleNestedUpdate('accommodation', 'isRequired', e.target.checked)}
                                        />
                                        <span className="font-sans font-bold text-slate-700 tracking-wide">NEED ACCOMMODATION</span>
                                    </label>
                                    {guest.accommodation?.isRequired && (
                                        <div className="flex items-center justify-between p-2">
                                            <span className="text-sm font-sans text-slate-500 uppercase font-bold">Rooms Needed:</span>
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

                        <div className="pt-8 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-5 rounded-2xl bg-slate-900 text-white font-sans font-bold text-lg tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-black'
                                    }`}
                            >
                                {submitting ? 'SAVING...' : 'FINALIZE MY DETAILS'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
