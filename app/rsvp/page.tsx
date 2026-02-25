'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function RSVPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const wedding = searchParams.get('wedding');
        // Redirect to the new unified details/invitation flow
        router.push(`/details${wedding ? `?wedding=${wedding}` : ''}`);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-rose-600 font-serif text-xl animate-pulse">Welcoming You to #Ishanya...</p>
            </div>
        </div>
    );
}
