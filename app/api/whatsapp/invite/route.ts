import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { sendWhatsAppMessage } from '@/lib/whatsapp/client';

export async function POST(request: NextRequest) {
    try {
        const { guestId } = await request.json();

        if (!guestId) {
            return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
        }

        // 1. Fetch Guest Details
        const guestRef = doc(db, 'guests', guestId);
        const guestSnap = await getDoc(guestRef);

        if (!guestSnap.exists()) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        const guest = guestSnap.data();
        let phone = guest.phone;
        const fullName = guest.fullName;
        const weddingId = guest.weddingId;

        if (!phone) {
            return NextResponse.json({ error: 'Guest phone number not found' }, { status: 400 });
        }

        // Sanitize phone number to ensure it has a country code (assuming India +91 if 10 digits)
        phone = phone.replace(/\\D/g, '');
        if (phone.length === 10) {
            phone = '91' + phone;
        }

        // 2. Construct RSVP URL
        // Using the base URL from the request or defaulting to the production domain
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://indian-wedding-manager.vercel.app';
        const rsvpUrl = `${baseUrl}/rsvp?wedding=${weddingId}&phone=${phone}&name=${encodeURIComponent(fullName)}`;

        // 3. Send WhatsApp Message
        // For production, this should use a verified Template. 
        // For now, we use a personalized text message.
        const message = `Namaste ${fullName}! 🙏\n\nWe are delighted to invite you to our wedding. Please click the link below to view your invitation and share your RSVP details:\n\n${rsvpUrl}\n\nWe can't wait to celebrate with you! ✨`;

        await sendWhatsAppMessage(phone, 'text', message);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('WhatsApp Invite API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to send invite' }, { status: 500 });
    }
}
