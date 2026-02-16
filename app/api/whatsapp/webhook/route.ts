import { NextRequest, NextResponse } from 'next/server';
import { processConversation } from '@/lib/whatsapp/conversation';

// Constants
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'wedding-planner-verify-token';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Incoming Webhook:', JSON.stringify(body, null, 2));

        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const value = body.entry[0].changes[0].value;
                const message = value.messages[0];
                const phone = message.from;
                const messageBody = message.text?.body || '';
                const name = value.contacts?.[0]?.profile?.name || 'Guest';

                if (message.type === 'text') {
                    // Process the conversation in background (don't block webhook response)
                    // Note: In serverless, we should ideally wait, but for Vercel free tier 10s timeout, simple logic is fine.
                    await processConversation(phone, messageBody, name);
                }
            }
            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        } else {
            return new NextResponse('Not Found', { status: 404 });
        }
    } catch (error) {
        console.error('Webhook Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
