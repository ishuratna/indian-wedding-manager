'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Vendor, VendorCategory } from '@/app/types/vendor';
import { useAuth } from '@/lib/auth/AuthContext';

export default function VendorsPage() {
    const { weddingId: authWeddingId } = useAuth();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [weddingId, setWeddingId] = useState(authWeddingId || '');
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState<string | null>(null);

    useEffect(() => {
        if (authWeddingId) {
            setWeddingId(authWeddingId);
        }
    }, [authWeddingId]);

    useEffect(() => {
        if (weddingId) {
            setLoading(true);
            fetch(`/api/vendors?weddingId=${weddingId}`)
                .then((res) => res.json())
                .then(data => {
                    setVendors(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [weddingId]);

    const sendVendorUpdate = async (vendor: Vendor) => {
        if (!vendor.phone) return alert('No phone number for this vendor');

        setSendingId(vendor.id!);
        try {
            const res = await fetch('/api/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: vendor.phone,
                    type: 'template',
                    content: { name: 'hello_world', lang: 'en_US' } // Using std template for demo
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Message sent to ${vendor.businessName}!`);
            } else {
                alert(`Failed: ${data.error}`);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setSendingId(null);
        }
    };

    // Group vendors by category
    const groupedVendors = vendors.reduce((acc, vendor) => {
        const cat = vendor.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(vendor);
        return acc;
    }, {} as Record<VendorCategory, Vendor[]>);

    const categories = Object.keys(groupedVendors) as VendorCategory[];

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">My Vendors</h1>
                    <div className="flex items-center gap-3">
                        <input
                            className="text-sm border-zinc-200 rounded-md px-3 py-1.5 bg-zinc-50"
                            placeholder="Wedding ID"
                            value={weddingId}
                            onChange={(e) => setWeddingId(e.target.value)}
                        />
                        <Link
                            href="/marketplace"
                            className="inline-flex items-center justify-center rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                            🏪 Browse Marketplace
                        </Link>
                        <Link
                            href="/vendors/add"
                            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                        >
                            Add Vendor
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="p-12 text-center text-zinc-500">Loading vendors...</div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                        <h3 className="text-lg font-medium text-zinc-900">No vendors yet</h3>
                        <p className="text-zinc-500 mt-2">Start shortlisting venues, photographers, and more.</p>
                        <Link
                            href="/vendors/add"
                            className="mt-6 inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
                        >
                            Add First Vendor
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {categories.map(category => (
                            <section key={category}>
                                <h2 className="text-lg font-bold text-zinc-900 mb-4 px-1">{category}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupedVendors[category].map(vendor => (
                                        <div key={vendor.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                            <div className="p-5 flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-zinc-900 text-lg truncate pr-2">{vendor.businessName}</h3>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                                                ${vendor.status === 'Booked' ? 'bg-green-100 text-green-700' :
                                                            vendor.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-zinc-100 text-zinc-600'}`}>
                                                        {vendor.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-500 mb-4">{vendor.contactName}</p>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between text-zinc-600">
                                                        <span>Total:</span>
                                                        <span className="font-medium text-zinc-900">₹{vendor.paymentTerms.totalAmount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-zinc-600">
                                                        <span>Paid:</span>
                                                        <span className="text-green-600">₹{vendor.paymentTerms.advancePaid.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-zinc-600 border-t border-zinc-100 pt-2">
                                                        <span className="font-medium">Due:</span>
                                                        <span className="font-bold text-red-600">₹{vendor.paymentTerms.balanceDue.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-zinc-50 px-5 py-3 border-t border-zinc-100 flex items-center justify-between">
                                                <a
                                                    href={`tel:${vendor.phone}`}
                                                    className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                                                >
                                                    📞 {vendor.phone}
                                                </a>
                                                <button
                                                    onClick={() => sendVendorUpdate(vendor)}
                                                    disabled={sendingId === vendor.id}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-lg border border-green-200 transition-colors disabled:opacity-50"
                                                >
                                                    {sendingId === vendor.id ? 'Sending...' : '💬 Send Update'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
