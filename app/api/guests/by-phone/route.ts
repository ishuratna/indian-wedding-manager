import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const weddingId = searchParams.get('weddingId');
        let phone = searchParams.get('phone');

        if (!weddingId || !phone) {
            return NextResponse.json({ error: 'weddingId and phone required' }, { status: 400 });
        }

        // Clean up the phone number similarly to the backend
        phone = phone.replace(/\D/g, '');
        if (phone.length === 10) {
            phone = '91' + phone;
        }

        const q = query(
            collection(db, 'guests'),
            where('weddingId', '==', weddingId),
            where('phone', '==', phone) // or maybe we need to search exactly what they entered...
        );

        let snapshot = await getDocs(q);

        // If not found with country code, try original input just in case they added it with '+' or didn't add country code when registering
        if (snapshot.empty) {
            const rawPhoneQ = query(collection(db, 'guests'), where('weddingId', '==', weddingId), where('phone', '==', searchParams.get('phone')!));
            snapshot = await getDocs(rawPhoneQ);
        }

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Guest not found with this phone number.' }, { status: 404 });
        }

        const guestDoc = snapshot.docs[0];
        const guest = { id: guestDoc.id, ...guestDoc.data() };

        return NextResponse.json(guest);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
