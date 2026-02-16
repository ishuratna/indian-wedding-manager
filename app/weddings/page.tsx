'use client';

import { useState } from 'react';

export default function WeddingsPage() {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brideName,
          groomName,
          weddingDate,
          location,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setStatus('success');
      setBrideName('');
      setGroomName('');
      setWeddingDate('');
      setLocation('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Create Wedding</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bride Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Groom Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Wedding Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location (City / Venue)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'saving'}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving...' : 'Save Wedding'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-600 text-sm">Wedding saved in Firestore ✅</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-sm">Error: {errorMsg}</p>
        )}
      </div>
    </div>
  );
}
