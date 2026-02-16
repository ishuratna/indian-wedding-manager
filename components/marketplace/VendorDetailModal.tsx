'use client';

import { MarketplaceVendor } from '@/app/types/vendor';

interface Props {
    vendor: MarketplaceVendor;
    isShortlisted: boolean;
    onClose: () => void;
    onShortlist: () => void;
    shortlisting: boolean;
}

export default function VendorDetailModal({ vendor, isShortlisted, onClose, onShortlist, shortlisting }: Props) {
    const renderStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <span className="flex items-center gap-0.5 text-amber-400 text-lg">
                {Array.from({ length: full }).map((_, i) => <span key={i}>★</span>)}
                {half && <span>★</span>}
                {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => <span key={`e-${i}`} className="text-zinc-300">★</span>)}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="p-6 pb-4 border-b border-zinc-100">
                    <div className="text-xs text-zinc-400 uppercase tracking-wide mb-1">{vendor.category}</div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">{vendor.name}</h2>
                    <div className="flex items-center gap-3 mb-3">
                        {renderStars(vendor.rating)}
                        <span className="text-sm text-zinc-500">{vendor.rating} ({vendor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-600">
                        <span className="flex items-center gap-1">📍 {vendor.city}</span>
                        <span className="font-semibold text-zinc-800">{vendor.priceRange}</span>
                    </div>
                </div>

                {/* About */}
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide mb-3">About</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{vendor.description}</p>
                </div>

                {/* Highlights */}
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide mb-3">Highlights</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {vendor.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                                <span className="text-emerald-500 shrink-0">✓</span>
                                <span>{h}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide mb-3">Specialities</h3>
                    <div className="flex flex-wrap gap-2">
                        {vendor.tags.map(tag => (
                            <span key={tag} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide mb-3">Contact Information</h3>
                    <div className="space-y-3">
                        <a href={`tel:${vendor.phone}`} className="flex items-center gap-3 text-sm text-zinc-700 hover:text-purple-700 transition-colors">
                            <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">📞</span>
                            <span className="font-medium">{vendor.phone}</span>
                        </a>
                        <a href={`mailto:${vendor.email}`} className="flex items-center gap-3 text-sm text-zinc-700 hover:text-purple-700 transition-colors">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">✉️</span>
                            <span className="font-medium">{vendor.email}</span>
                        </a>
                        <div className="flex items-center gap-3 text-sm text-zinc-600">
                            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">📍</span>
                            <span>{vendor.address}</span>
                        </div>
                    </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="sticky bottom-0 bg-white border-t border-zinc-200 p-4 flex items-center gap-3">
                    {isShortlisted ? (
                        <div className="flex-1 py-3 text-center text-sm font-semibold text-green-700 bg-green-50 rounded-xl border border-green-200">
                            ✓ Added to My Vendors
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={onShortlist}
                                disabled={shortlisting}
                                className="flex-1 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                            >
                                {shortlisting ? 'Adding...' : '⭐ Shortlist Vendor'}
                            </button>
                        </>
                    )}
                    <a
                        href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
                    >
                        💬 WhatsApp
                    </a>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
