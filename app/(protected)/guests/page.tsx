'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Guest } from '@/app/types/guest';
import { useAuth } from '@/lib/auth/AuthContext';

export default function GuestsPage() {
  const { weddingId: authWeddingId } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [weddingId, setWeddingId] = useState(authWeddingId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authWeddingId) {
      setWeddingId(authWeddingId);
    }
  }, [authWeddingId]);

  // WhatsApp Test State
  const [testPhone, setTestPhone] = useState('');
  const [sendingWa, setSendingWa] = useState(false);
  const [waStatus, setWaStatus] = useState('');

  useEffect(() => {
    if (weddingId) {
      setLoading(true);
      fetch(`/api/guests?weddingId=${weddingId}`)
        .then((res) => res.json())
        .then(data => {
          setGuests(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [weddingId]);

  const sendTestMessage = async () => {
    if (!testPhone) return;
    setSendingWa(true);
    setWaStatus('');
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testPhone,
          type: 'template',
          content: { name: 'hello_world', lang: 'en_US' } // Standard Meta test template
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setWaStatus('Message sent! ✅');
      } else {
        setWaStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setWaStatus(`Error: ${err.message}`);
    } finally {
      setSendingWa(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Guest Manager</h1>
          <div className="flex items-center gap-4">
            <input
              className="text-sm border-zinc-200 rounded-md px-3 py-1.5 bg-zinc-50"
              placeholder="Wedding ID"
              value={weddingId}
              onChange={(e) => setWeddingId(e.target.value)}
            />
            <Link
              href="/guests/add"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add Guest
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* WhatsApp Test Section */}
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Quick Test Integration
            </h2>
            <p className="text-sm text-green-700 mt-1">
              Enter your number to test the connection.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="tel"
              placeholder="e.g. 15551234567"
              className="border-green-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 w-full sm:w-48"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
            <button
              onClick={sendTestMessage}
              disabled={sendingWa || !testPhone}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
            >
              {sendingWa ? 'Sending...' : 'Send Test'}
            </button>
          </div>
        </div>
        {waStatus && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${waStatus.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-100 text-green-800'}`}>
            {waStatus}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-zinc-100">
            <dt className="truncate text-sm font-medium text-zinc-500">Total Guests</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">{guests.length}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-zinc-100">
            <dt className="truncate text-sm font-medium text-zinc-500">Confirmed</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
              {guests.filter(g => g.rsvpStatus === 'Confirmed').length}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-zinc-100">
            <dt className="truncate text-sm font-medium text-zinc-500">Groom Side</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">
              {guests.filter(g => g.side === 'Groom').length}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-zinc-100">
            <dt className="truncate text-sm font-medium text-zinc-500">Bride Side</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-pink-600">
              {guests.filter(g => g.side === 'Bride').length}
            </dd>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading guests...</div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">No guests found</h3>
              <p className="mt-1 text-sm text-zinc-500">Get started by adding a new guest.</p>
              <div className="mt-6">
                <Link
                  href="/guests/add"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Add Guest
                </Link>
              </div>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-zinc-100">
              {guests.map((guest) => (
                <li key={guest.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap px-6 hover:bg-zinc-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold leading-6 text-zinc-900">
                      {guest.fullName}
                      <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                                        ${guest.side === 'Groom' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' :
                          guest.side === 'Bride' ? 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20' :
                            'bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-500/10'}`}>
                        {guest.side}
                      </span>
                      <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium 
                                        ${guest.rsvpStatus === 'Confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                          guest.rsvpStatus === 'Declined' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' :
                            'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'}`}>
                        {guest.rsvpStatus}
                      </span>
                    </p>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-500">
                      <p>
                        <span className="font-medium">Group:</span> {guest.group}
                      </p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p>{guest.phone}</p>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <p>{guest.events?.length || 0} Events</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-none gap-x-4 sm:w-auto">
                    <div className="flex flex-col items-end">
                      <p className="text-sm leading-6 text-zinc-900">{guest.arrival?.mode ? `Arrives by ${guest.arrival.mode}` : 'No arrival info'}</p>
                      <p className="text-xs leading-5 text-zinc-500">{guest.arrival?.date ? new Date(guest.arrival.date).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
