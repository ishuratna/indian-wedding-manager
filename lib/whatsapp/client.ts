
const WHATSAPP_API_URL = 'https://graph.facebook.com/v22.0'; // Version 22.0

interface WhatsAppMessage {
    messaging_product: 'whatsapp';
    to: string;
    type: 'template' | 'text';
    template?: {
        name: string;
        language: {
            code: string;
        };
    };
    text?: {
        body: string;
    };
}

export async function sendWhatsAppMessage(to: string, type: 'template' | 'text', content: string | { name: string, lang: string }) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        throw new Error('Missing WhatsApp configuration (TOKEN or PHONE_NUMBER_ID)');
    }

    const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: to,
        type: type,
    };

    if (type === 'template' && typeof content === 'object') {
        payload.template = {
            name: content.name,
            language: { code: content.lang }
        };
    } else if (type === 'text' && typeof content === 'string') {
        payload.text = { body: content };
    } else {
        throw new Error('Invalid content for message type');
    }

    const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('WhatsApp API Error:', data);
        throw new Error(data.error?.message || 'Failed to send WhatsApp message');
    }

    return data;
}
