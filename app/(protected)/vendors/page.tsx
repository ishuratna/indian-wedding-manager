'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vendor, VendorCategory } from '@/app/types/vendor';
import { useAuth } from '@/lib/auth/AuthContext';

export default function VendorsPage() {
    const { weddingId: authWeddingId } = useAuth();
    const router = useRouter();
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

    // Separate vendors by status groups
    const shortlisted = vendors.filter(v => v.status === 'Shortlisted' || v.status === 'Contacted');
    const booked = vendors.filter(v => v.status !== 'Shortlisted' && v.status !== 'Contacted');

    const renderVendorCard = (vendor: Vendor) => (
        <div key={vendor.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-zinc-900 text-lg truncate pr-2">{vendor.businessName}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                ${vendor.status === 'Booked' || vendor.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            vendor.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-zinc-100 text-zinc-600'}`}>
                        {vendor.status}
                    </span>
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wide mb-3">{vendor.category}</div>
                <p className="text-sm text-zinc-500 mb-4">{vendor.contactName}</p>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-zinc-600">
                        <span>Total:</span>
                        <span className="font-medium text-zinc-900">₹{(vendor.paymentTerms?.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                        <span>Paid:</span>
                        <span className="text-green-600">₹{(vendor.paymentTerms?.advancePaid || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 border-t border-zinc-100 pt-2">
                        <span className="font-medium">Due:</span>
                        <span className="font-bold text-red-600">₹{(vendor.paymentTerms?.balanceDue || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 px-5 py-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <a
                    href={`tel:${vendor.phone}`}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                >
                    📞 Call
                </a>
                <div className="flex gap-2">
                    {vendor.status === 'Shortlisted' && (
                        <button
                            onClick={() => router.push(`/vendors/add?id=${vendor.id}`)}
                            className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Finalize Booking
                        </button>
                    )}
                    <button
                        onClick={() => sendVendorUpdate(vendor)}
                        disabled={sendingId === vendor.id}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-lg border border-green-200 transition-colors disabled:opacity-50"
                    >
                        {sendingId === vendor.id ? '...' : '💬 Update'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Wedding Pro Agent</span>
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight font-serif">My Vendors</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/marketplace"
                            className="inline-flex items-center justify-center rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                            🏪 Marketplace
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
                    <div className="p-12 text-center text-zinc-500 italic">Searching for your dream team...</div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-zinc-200">
                        <div className="text-4xl mb-4">💍</div>
                        <h3 className="text-lg font-bold text-zinc-900">No vendors joined yet</h3>
                        <p className="text-zinc-500 mt-2 max-w-xs mx-auto">Shortlist vendors from the marketplace to build your wedding dream team.</p>
                        <Link
                            href="/marketplace"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-rose-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-rose-700 transition-all hover:scale-105"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Shortlisted Section */}
                        {shortlisted.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6 px-1">
                                    <h2 className="text-2xl font-bold text-zinc-900">Shortlisted</h2>
                                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full font-bold">{shortlisted.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {shortlisted.map(renderVendorCard)}
                                </div>
                            </section>
                        )}

                        {/* Hired Section */}
                        {booked.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6 px-1">
                                    <h2 className="text-2xl font-bold text-zinc-900">Hired & Finalized</h2>
                                    <span className="text-sm bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-bold">{booked.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {booked.map(renderVendorCard)}
                                </div>
                            </section>
                        )}

                        {shortlisted.length === 0 && booked.length > 0 && (
                            <div className="text-center py-10 bg-zinc-100/50 rounded-2xl border border-dotted border-zinc-300">
                                <p className="text-zinc-500 text-sm">Need more options? <Link href="/marketplace" className="text-purple-600 font-bold hover:underline">Browse the Marketplace</Link></p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
