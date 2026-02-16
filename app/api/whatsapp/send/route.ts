import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, type, content } = body;

        if (!to || !type || !content) {
            return NextResponse.json({ error: 'Missing required fields (to, type, content)' }, { status: 400 });
        }

        // Basic phone number validation/formatting (ensure it has country code)
        // For now, we assume the user sends it correctly or we could prepend '+' if missing but Meta usually needs clean number
        // Let's just pass it through for now.

        const result = await sendWhatsAppMessage(to, type, content);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error('WhatsApp API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
