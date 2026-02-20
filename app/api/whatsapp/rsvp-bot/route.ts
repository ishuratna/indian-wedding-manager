import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendWhatsAppMessage } from '@/lib/whatsapp/client';

export async function POST(request: NextRequest) {
    try {
        const { guestId } = await request.json();

        if (!guestId) {
            return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
        }

        const guestRef = doc(db, 'guests', guestId);
        const guestSnap = await getDoc(guestRef);

        if (!guestSnap.exists()) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        const guest = guestSnap.data();
        const phone = guest.phone;
        const fullName = guest.fullName;

        if (!phone) {
            return NextResponse.json({ error: 'Guest phone number not found' }, { status: 400 });
        }

        // 1. Send Initial Bot Message
        const message = `Namaste ${fullName}! 🙏\n\nI'm Tanya & Ishu's Wedding Assistant. 🤖\n\nI can help you RSVP and collect your details right here on WhatsApp! \n\nTo get started, please tell me your full name or just reply "Hi".`;

        await sendWhatsAppMessage(phone, 'text', message);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('WhatsApp Bot Trigger API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to trigger bot' }, { status: 500 });
    }
}
