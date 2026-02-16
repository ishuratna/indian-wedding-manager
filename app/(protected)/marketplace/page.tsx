'use client';

import Link from 'next/link';
import { CATEGORY_META, getCategoryCount } from '@/lib/data/marketplaceData';

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Vendor Marketplace</h1>
                        <p className="text-xs text-zinc-500 -mt-0.5">Browse & shortlist vendors for your dream wedding</p>
                    </div>
                    <Link
                        href="/vendors"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                        📋 My Vendors
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
                        Find the Perfect Team for Your <span className="text-rose-600">Big Day</span>
                    </h2>
                    <p className="text-zinc-500 mt-3 max-w-2xl mx-auto">
                        Hand-picked vendors across every category. Browse, compare, and shortlist — all in one place.
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {CATEGORY_META.map((cat) => {
                        const count = getCategoryCount(cat.category);
                        return (
                            <Link
                                key={cat.category}
                                href={`/marketplace/${encodeURIComponent(cat.category)}`}
                                className={`group relative p-6 rounded-2xl border ${cat.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center`}
                            >
                                <div className="text-4xl mb-3">{cat.icon}</div>
                                <h3 className="font-bold text-base mb-1">{cat.category}</h3>
                                <p className="text-xs opacity-70 leading-snug mb-3">{cat.tagline}</p>
                                <div className="inline-flex items-center gap-1 text-xs font-semibold opacity-60">
                                    {count} vendors →
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl border border-zinc-100 p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-zinc-900 font-serif">60+</div>
                        <div className="text-sm text-zinc-500 mt-1">Verified Vendors</div>
                    </div>
                    <div className="bg-white rounded-xl border border-zinc-100 p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-zinc-900 font-serif">10</div>
                        <div className="text-sm text-zinc-500 mt-1">Categories</div>
                    </div>
                    <div className="bg-white rounded-xl border border-zinc-100 p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-zinc-900 font-serif">4.6</div>
                        <div className="text-sm text-zinc-500 mt-1">Avg. Rating</div>
                    </div>
                    <div className="bg-white rounded-xl border border-zinc-100 p-6 text-center shadow-sm">
                        <div className="text-3xl font-bold text-zinc-900 font-serif">15+</div>
                        <div className="text-sm text-zinc-500 mt-1">Cities Covered</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
