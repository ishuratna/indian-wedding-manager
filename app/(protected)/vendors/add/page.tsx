'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vendor, VendorCategory, VendorStatus } from '@/app/types/vendor';
import { useAuth } from '@/lib/auth/AuthContext';

const CATEGORIES: VendorCategory[] = [
    'Venue', 'Catering', 'Decor', 'Photography', 'Makeup', 'Music/DJ', 'Logistics', 'Mehandi', 'Pandit', 'Other'
];

const STATUSES: VendorStatus[] = [
    'Shortlisted', 'Contacted', 'Booked', 'Paid', 'Completed', 'Cancelled'
];

export default function AddVendorPage() {
    const { weddingId } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
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

    const handleChange = (field: keyof Vendor, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentChange = (field: string, value: any) => {
        setFormData(prev => {
            const newTerms = { ...prev.paymentTerms!, [field]: value };
            // Auto-calculate balance if amounts change
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
            const res = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add vendor');
            }

            router.push('/vendors');
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
                    <h1 className="text-3xl font-bold text-zinc-900">Add New Vendor</h1>
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
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Wedding ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!weddingId}
                                        placeholder="Enter Wedding ID"
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4 bg-zinc-50"
                                        value={formData.weddingId}
                                        onChange={e => handleChange('weddingId', e.target.value)}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.businessName}
                                        onChange={e => handleChange('businessName', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.category}
                                        onChange={e => handleChange('category', e.target.value)}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                                    <select
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.status}
                                        onChange={e => handleChange('status', e.target.value)}
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
                                Contact Person
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Contact Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.contactName}
                                        onChange={e => handleChange('contactName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 3. Financials */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                            <h2 className="text-lg font-semibold text-zinc-800 mb-4">Payment Terms</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Total Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3"
                                        value={formData.paymentTerms?.totalAmount}
                                        onChange={e => handlePaymentChange('totalAmount', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Advance Paid (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3"
                                        value={formData.paymentTerms?.advancePaid}
                                        onChange={e => handlePaymentChange('advancePaid', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Balance Due (₹)</label>
                                    <input
                                        type="number"
                                        disabled
                                        className="w-full rounded-lg border-zinc-300 py-2 px-3 bg-zinc-100 text-zinc-500 cursor-not-allowed"
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
                                className="px-6 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : 'Save Vendor'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
