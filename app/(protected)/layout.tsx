'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <div>
            {/* Top Navigation Bar for authenticated users */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a href="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl">💍</span>
                            <span className="font-bold text-lg text-rose-600 font-serif">EasyWeddings</span>
                        </a>
                        <div className="hidden sm:flex items-center gap-4 ml-4">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50">Dashboard</a>
                            <a href="/guests" className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50">Guests</a>
                            <a href="/marketplace" className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50">Marketplace</a>
                            <a href="/vendors" className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50">My Vendors</a>
                        </div>
                    </div>
                    <UserMenu />
                </div>
            </nav>
            {children}
        </div>
    );
}

function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push('/');
    }

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
                Log Out
            </button>
        </div>
    );
}
