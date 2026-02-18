'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vendor, VendorCategory, VendorStatus } from '@/app/types/vendor';
import { useAuth } from '@/lib/auth/AuthContext';

const CATEGORIES: VendorCategory[] = [
    'Venue', 'Catering', 'Decor', 'Photography', 'Makeup', 'Entertainment', 'Logistics', 'Mehandi', 'Pandit', 'Other'
];

const STATUSES: VendorStatus[] = [
    'Shortlisted', 'Contacted', 'Booked', 'Paid', 'Completed', 'Cancelled'
];

function AddVendorContent() {
    const { weddingId } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(!!editId);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<Vendor>>({
        weddingId: weddingId || '',
        businessName: '',
        contactName: '',
        category: 'Venue',
        phone: '',
        email: '',
        address: '',
        status: 'Shortlisted',
        rating: 0,
        notes: '',
        whatsappOptIn: true,
        paymentTerms: {
            totalAmount: 0,
            advancePaid: 0,
            balanceDue: 0,
            dueDate: '',
            status: 'Pending'
        }
    });

    useEffect(() => {
        if (editId) {
            fetch(`/api/vendors/${editId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setFormData({
                        ...data,
                        status: data.status === 'Shortlisted' ? 'Booked' : data.status
                    });
                    setFetching(false);
                })
                .catch(err => {
                    setError('Failed to load vendor details');
                    setFetching(false);
                });
        }
    }, [editId]);

    useEffect(() => {
        if (weddingId && !editId) {
            setFormData(prev => ({ ...prev, weddingId }));
        }
    }, [weddingId, editId]);

    const handleChange = (field: keyof Vendor, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentChange = (field: string, value: any) => {
        setFormData(prev => {
            const newTerms = { ...prev.paymentTerms!, [field]: value };
            if (field === 'totalAmount' || field === 'advancePaid') {
                newTerms.balanceDue = Number(newTerms.totalAmount) - Number(newTerms.advancePaid);
            }
            return { ...prev, paymentTerms: newTerms };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const url = editId ? `/api/vendors/${editId}` : '/api/vendors';
            const method = editId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save vendor');
            }

            router.push('/vendors');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) return <div className="p-12 text-center text-zinc-500">Loading details...</div>;

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-zinc-900">{editId ? 'Finalize Booking' : 'Add New Vendor'}</h1>
                    <p className="mt-2 text-zinc-600">Track services, contracts, and payments.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-zinc-100">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 text-sm text-center border-b border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="p-8 space-y-10">
                        {/* 1. Basic Info */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Business Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-zinc-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.businessName}
                                        onChange={e => handleChange('businessName', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-200 shadow-sm focus:ring-purple-500 py-3 px-4"
                                        value={formData.category}
                                        onChange={e => handleChange('category', e.target.value as VendorCategory)}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-200 shadow-sm focus:ring-purple-500 py-3 px-4"
                                        value={formData.status}
                                        onChange={e => handleChange('status', e.target.value as VendorStatus)}
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 2. Contact Info */}
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Contact Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-zinc-200 shadow-sm focus:ring-purple-500 py-3 px-4"
                                        value={formData.contactName}
                                        onChange={e => handleChange('contactName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-lg border-zinc-200 shadow-sm focus:ring-purple-500 py-3 px-4"
                                        value={formData.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 3. Financials */}
                        <section className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 shadow-inner">
                            <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                                💰 Payment Terms
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">How much to pay? (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border-zinc-200 py-3 px-4 focus:ring-purple-500 font-bold text-zinc-900"
                                        value={formData.paymentTerms?.totalAmount}
                                        onChange={e => handlePaymentChange('totalAmount', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">How much paid? (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border-zinc-200 py-3 px-4 focus:ring-purple-500 text-green-700 font-bold"
                                        value={formData.paymentTerms?.advancePaid}
                                        onChange={e => handlePaymentChange('advancePaid', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">Remaining Balance (₹)</label>
                                    <input
                                        type="number"
                                        disabled
                                        className="w-full rounded-xl border-zinc-100 py-3 px-4 bg-white/50 text-red-600 font-bold shadow-sm"
                                        value={formData.paymentTerms?.balanceDue}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-10 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-70"
                            >
                                {submitting ? 'Saving...' : editId ? 'Confirm Booking' : 'Save Vendor'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AddVendorPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading...</div>}>
            <AddVendorContent />
        </Suspense>
    );
}
