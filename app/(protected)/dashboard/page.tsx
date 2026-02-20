'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAgent } from "@/lib/context/AgentContext";

export default function Dashboard() {
  const { user, weddingId } = useAuth();
  const { activeAgent } = useAgent();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-5xl mx-auto py-20 px-6 sm:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 font-serif mb-2">
            {activeAgent === 'rsvp' ? 'RSVP Command Center' : 'Wedding Pro Dashboard'}
          </h1>
          <p className="text-slate-500 text-lg">
            Welcome back, <span className="text-rose-600 font-semibold">{user?.email?.split('@')[0]}</span>. {activeAgent === 'rsvp' ? 'Your guest list is looking great.' : 'Your wedding business metrics are ready.'}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400 bg-white border border-slate-200 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            ID: {weddingId || 'Loading...'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {activeAgent === 'rsvp' ? (
            <>
              {/* Guests */}
              <Link
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-blue-100 hover:bg-blue-50/30"
                href="/guests"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Guest Manager</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Manage RSVPs, coordinate meal preferences, and track travel logistics.
                </p>
                <span className="text-xs font-semibold text-blue-600">Open Manager →</span>
              </Link>

              {/* RSVP Form Link */}
              <div
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-green-100 hover:bg-green-50/30 cursor-pointer"
                onClick={() => {
                  const url = `${window.location.origin}/rsvp?wedding=${weddingId}`;
                  navigator.clipboard.writeText(url);
                  alert('Invitation link copied!');
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">RSVP Link</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Copy your unique wedding invitation link to share with guests.
                </p>
                <span className="text-xs font-semibold text-green-600">Copy Link →</span>
              </div>
            </>
          ) : (
            <>
              {/* Vendors */}
              <Link
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-purple-100 hover:bg-purple-50/30"
                href="/vendors"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  📋
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">My Vendor Board</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Track contracts, payments, and deadlines for your hired professionals.
                </p>
                <span className="text-xs font-semibold text-purple-600">View Board →</span>
              </Link>

              {/* Marketplace */}
              <Link
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-rose-100 hover:bg-rose-50/30"
                href="/marketplace"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🏪
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Marketplace</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Discover and shortlist world-class venues and decorators.
                </p>
                <span className="text-xs font-semibold text-rose-600">Browse →</span>
              </Link>

              {/* Budget */}
              <Link
                className="group flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-amber-100 hover:bg-amber-50/30"
                href="/budget"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  💰
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Budget Manager</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Centralize financial planning and track payments in real-time.
                </p>
                <span className="text-xs font-semibold text-amber-600">Track Budget →</span>
              </Link>
            </>
          )}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-slate-900 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 font-serif">Ready for the Big Day?</h2>
            <p className="text-slate-400 max-w-lg mb-6">
              Use the WhatsApp Assistant to automatically collect logistics data from guests. Every reply syncs instantly to your dashboard.
            </p>
            <Link href="/guests" className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors">
              Try WhatsApp Automation
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-full opacity-10 pointer-events-none">
            <span className="text-[200px] leading-none">💍</span>
          </div>
        </div>
      </main>
    </div>
  );
}
