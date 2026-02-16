'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Guest, Side, Group, Gender, AgeGroup, RSVPStatus, Dietary } from '@/app/types/guest';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AddGuestPage() {
    const { weddingId } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Initial State matches the Guest interface
    const [formData, setFormData] = useState<Partial<Guest>>({
        weddingId: weddingId || '', // Ideally pre-filled or from context
        fullName: '',
        gender: 'Male',
        ageGroup: 'Adult',
        side: 'Groom',
        group: 'Friend',
        relationship: '',
        phone: '',
        email: '',
        whatsappOptIn: true,
        rsvpStatus: 'Pending',
        events: [],
        dietaryRestrictions: [],
        allergies: '',
        arrival: {
            date: '',
            time: '',
            mode: 'Flight',
            pickupRequired: false
        },
        departure: {
            date: '',
            time: '',
            mode: 'Flight',
            dropoffRequired: false
        },
        accommodation: {
            isRequired: false,
            roomsNeeded: 0
        }
    });

    const handleChange = (field: keyof Guest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (error) setError('');
    };

    const handleNestedChange = (parent: 'arrival' | 'departure' | 'accommodation', field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent] as any, [field]: value }
        }));
    };

    const toggleSelection = (field: keyof Guest, item: string) => {
        setFormData(prev => {
            const currentList = (prev[field] as string[]) || [];
            const newList = currentList.includes(item)
                ? currentList.filter(i => i !== item)
                : [...currentList, item];
            return { ...prev, [field]: newList };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add guest');
            }

            router.push('/guests');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-zinc-900">Add New Guest</h1>
                    <p className="mt-2 text-zinc-600">Enter comprehensive details for the wedding guest.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-zinc-100">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 text-sm text-center border-b border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="p-8 space-y-10">
                        {/* 1. Wedding Context */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Wedding Details
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Wedding ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    disabled={!!weddingId}
                                    placeholder="Enter Wedding ID"
                                    className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-zinc-50"
                                    value={formData.weddingId}
                                    onChange={e => handleChange('weddingId', e.target.value)}
                                />
                            </div>
                        </section>

                        {/* 2. Basic Info */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.fullName}
                                        onChange={e => handleChange('fullName', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Side</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.side}
                                        onChange={e => handleChange('side', e.target.value)}
                                    >
                                        <option value="Groom">Groom Side</option>
                                        <option value="Bride">Bride Side</option>
                                        <option value="Common">Common</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Relationship Group</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.group}
                                        onChange={e => handleChange('group', e.target.value)}
                                    >
                                        <option value="Family">Family</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Colleague">Colleague</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Gender</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.gender}
                                        onChange={e => handleChange('gender', e.target.value)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Age Group</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.ageGroup}
                                        onChange={e => handleChange('ageGroup', e.target.value)}
                                    >
                                        <option value="Adult">Adult</option>
                                        <option value="Child">Child</option>
                                        <option value="Infant">Infant</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 3. Contact Info */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                    />
                                    <div className="mt-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            checked={formData.whatsappOptIn}
                                            onChange={e => handleChange('whatsappOptIn', e.target.checked)}
                                        />
                                        <label className="ml-2 block text-sm text-gray-700">Receive specific updates via WhatsApp</label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 4. Attendance & Diet */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                Attendance & Preferences
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">RSVP Status</label>
                                    <div className="flex gap-4">
                                        {['Confirmed', 'Tentative', 'Declined'].map(status => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleChange('rsvpStatus', status)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.rsvpStatus === status
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">Events Attending</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Sangeet', 'Haldi', 'Wedding Ceremony', 'Reception'].map(event => (
                                            <label key={event} className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-zinc-50">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                    checked={formData.events?.includes(event)}
                                                    onChange={() => toggleSelection('events', event)}
                                                />
                                                <span className="text-sm text-zinc-700">{event}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">Dietary Preference</label>
                                        <select
                                            className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val) toggleSelection('dietaryRestrictions', val);
                                            }}
                                            value=""
                                        >
                                            <option value="" disabled>Add restriction...</option>
                                            <option value="Veg">Vegetarian</option>
                                            <option value="Non-Veg">Non-Vegetarian</option>
                                            <option value="Jain">Jain</option>
                                            <option value="Vegan">Vegan</option>
                                            <option value="Eggetarian">Eggetarian</option>
                                        </select>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.dietaryRestrictions?.map(d => (
                                                <span key={d} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {d}
                                                    <button type="button" onClick={() => toggleSelection('dietaryRestrictions', d)} className="ml-1 text-green-600 hover:text-green-900">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1">Allergies / Notes</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                                            placeholder="e.g. Peanuts, Gluten"
                                            value={formData.allergies}
                                            onChange={e => handleChange('allergies', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Travel Details */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                            <h2 className="text-lg font-semibold text-zinc-800 mb-4">Travel Information</h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Arrival */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-zinc-700 flex items-center gap-2">
                                        ✈️ Arrival
                                    </h3>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 text-sm"
                                        value={formData.arrival?.date}
                                        onChange={e => handleNestedChange('arrival', 'date', e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 text-sm"
                                        value={formData.arrival?.time}
                                        onChange={e => handleNestedChange('arrival', 'time', e.target.value)}
                                    />
                                    <select
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 text-sm"
                                        value={formData.arrival?.mode}
                                        onChange={e => handleNestedChange('arrival', 'mode', e.target.value)}
                                    >
                                        <option value="Flight">Flight</option>
                                        <option value="Train">Train</option>
                                        <option value="Car">Car</option>
                                        <option value="Bus">Bus</option>
                                    </select>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="rounded text-blue-600"
                                            checked={formData.arrival?.pickupRequired}
                                            onChange={e => handleNestedChange('arrival', 'pickupRequired', e.target.checked)}
                                        />
                                        <span className="text-sm">Pickup Required</span>
                                    </label>
                                </div>

                                {/* Departure */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-zinc-700 flex items-center gap-2">
                                        🛫 Departure
                                    </h3>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 text-sm"
                                        value={formData.departure?.date}
                                        onChange={e => handleNestedChange('departure', 'date', e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 text-sm"
                                        value={formData.departure?.time}
                                        onChange={e => handleNestedChange('departure', 'time', e.target.value)}
                                    />
                                    <label className="flex items-center space-x-2 pt-10">
                                        <input
                                            type="checkbox"
                                            className="rounded text-blue-600"
                                            checked={formData.departure?.dropoffRequired}
                                            onChange={e => handleNestedChange('departure', 'dropoffRequired', e.target.checked)}
                                        />
                                        <span className="text-sm">Drop-off Required</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : 'Save Guest'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
