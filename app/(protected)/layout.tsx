'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAgent, AgentType } from '@/lib/context/AgentContext';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const { activeAgent, setActiveAgent } = useAgent();
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
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl">💍</span>
                            <span className="font-bold text-lg text-rose-600 font-serif">EasyWeddings</span>
                        </Link>

                        {/* Agent Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-xl items-center">
                            <button
                                onClick={() => setActiveAgent('rsvp')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeAgent === 'rsvp' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                RSVP Agent
                            </button>
                            <button
                                onClick={() => setActiveAgent('b2b')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeAgent === 'b2b' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Wedding Pro
                            </button>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-4 ml-2 sm:ml-4 overflow-x-auto no-scrollbar">
                            <Link href="/dashboard" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">Dashboard</Link>

                            {activeAgent === 'rsvp' ? (
                                <>
                                    <Link href="/guests" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">Guest List</Link>
                                    <Link href="/rsvp" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">RSVPs</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/marketplace" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">Marketplace</Link>
                                    <Link href="/vendors" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">Vendors</Link>
                                    <Link href="/budget" className="text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-rose-50 whitespace-nowrap">Budget</Link>
                                </>
                            )}
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
