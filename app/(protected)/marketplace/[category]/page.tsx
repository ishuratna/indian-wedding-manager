'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getVendorsByCategory, CATEGORY_META } from '@/lib/data/marketplaceData';
import { MarketplaceVendor, VendorCategory } from '@/app/types/vendor';
import VendorDetailModal from '@/components/marketplace/VendorDetailModal';
import { useAuth } from '@/lib/auth/AuthContext';

type SortOption = 'rating' | 'price-low' | 'price-high' | 'reviews';

export default function CategoryPage() {
    const { weddingId } = useAuth();
    const params = useParams();
    const router = useRouter();
    const category = decodeURIComponent(params.category as string) as VendorCategory;
    const vendors = getVendorsByCategory(category);
    const meta = CATEGORY_META.find(c => c.category === category);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('rating');
    const [selectedVendor, setSelectedVendor] = useState<MarketplaceVendor | null>(null);
    const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
    const [shortlisting, setShortlisting] = useState<string | null>(null);

    const filteredVendors = useMemo(() => {
        let result = [...vendors];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(v =>
                v.name.toLowerCase().includes(q) ||
                v.city.toLowerCase().includes(q) ||
                v.tags.some(t => t.toLowerCase().includes(q))
            );
        }
        switch (sortBy) {
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'price-low': result.sort((a, b) => a.priceMin - b.priceMin); break;
            case 'price-high': result.sort((a, b) => b.priceMin - a.priceMin); break;
            case 'reviews': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
        }
        return result;
    }, [vendors, search, sortBy]);

    const handleShortlist = async (vendor: MarketplaceVendor) => {
        setShortlisting(vendor.id);
        try {
            const res = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weddingId: weddingId || 'global',
                    businessName: vendor.name,
                    contactName: vendor.name,
                    category: vendor.category,
                    phone: vendor.phone,
                    email: vendor.email,
                    address: vendor.address,
                    status: 'Shortlisted',
                    rating: vendor.rating,
                    notes: `Source: Marketplace | ${vendor.description}`,
                    whatsappOptIn: true,
                    paymentTerms: {
                        totalAmount: vendor.priceMin,
                        advancePaid: 0,
                        balanceDue: vendor.priceMin,
                        status: 'Pending',
                    },
                }),
            });
            if (res.ok) {
                setShortlistedIds(prev => new Set(prev).add(vendor.id));
            } else {
                const data = await res.json();
                alert(`Failed: ${data.error}`);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setShortlisting(null);
        }
    };

    const renderStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <span className="flex items-center gap-0.5 text-amber-400 text-sm">
                {Array.from({ length: full }).map((_, i) => <span key={i}>★</span>)}
                {half && <span>★</span>}
                {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => <span key={`e-${i}`} className="text-zinc-300">★</span>)}
            </span>
        );
    };

    if (!meta) {
        return <div className="p-12 text-center">Category not found. <Link href="/marketplace" className="text-purple-600 underline">Go back</Link></div>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/marketplace')} className="text-zinc-400 hover:text-zinc-700 transition-colors text-sm">
                            ← All Categories
                        </button>
                        <span className="text-zinc-300">|</span>
                        <span className="text-2xl">{meta.icon}</span>
                        <h1 className="text-xl font-bold text-zinc-900">{category}</h1>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{vendors.length} vendors</span>
                    </div>
                    <Link
                        href="/vendors"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                        📋 My Vendors
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                    <input
                        type="text"
                        placeholder={`Search ${category.toLowerCase()} vendors...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-purple-400 focus:ring-purple-400 bg-white shadow-sm"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm bg-white shadow-sm"
                    >
                        <option value="rating">⭐ Highest Rated</option>
                        <option value="reviews">💬 Most Reviews</option>
                        <option value="price-low">💰 Price: Low → High</option>
                        <option value="price-high">💎 Price: High → Low</option>
                    </select>
                </div>

                {/* Vendor Cards */}
                {filteredVendors.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500">
                        No vendors found matching &quot;{search}&quot;
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVendors.map(vendor => {
                            const isShortlisted = shortlistedIds.has(vendor.id);
                            return (
                                <div key={vendor.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                                    {/* Card Header */}
                                    <div className="p-5 flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-zinc-900 truncate">{vendor.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {renderStars(vendor.rating)}
                                                    <span className="text-xs text-zinc-400">{vendor.rating} ({vendor.reviewCount})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                                            <span>📍 {vendor.city}</span>
                                            <span className="text-zinc-300">•</span>
                                            <span className="font-semibold text-zinc-700">{vendor.priceRange}</span>
                                        </div>

                                        <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                                            {vendor.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {vendor.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => setSelectedVendor(vendor)}
                                            className="text-sm font-medium text-purple-700 hover:text-purple-900 hover:underline transition-colors"
                                        >
                                            View Details →
                                        </button>
                                        {isShortlisted ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                                ✓ Shortlisted
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleShortlist(vendor)}
                                                disabled={shortlisting === vendor.id}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                            >
                                                {shortlisting === vendor.id ? 'Adding...' : '⭐ Shortlist'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedVendor && (
                <VendorDetailModal
                    vendor={selectedVendor}
                    isShortlisted={shortlistedIds.has(selectedVendor.id)}
                    onClose={() => setSelectedVendor(null)}
                    onShortlist={() => handleShortlist(selectedVendor)}
                    shortlisting={shortlisting === selectedVendor.id}
                />
            )}
        </div>
    );
}
