import { GoogleGenerativeAI } from '@google/generative-ai';
import { Guest } from '@/app/types/guest';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a friendly and efficient Wedding RSVP Assistant for Tanya & Ishu's wedding.
Your goal is to collect RSVP details from guests through a natural conversation.

CURRENT GUEST DATA:
{currentData}

USER MESSAGE:
"{message}"

INSTRUCTIONS:
1. Analyze the user's message to extract or update any of the following fields:
   - fullName (string)
   - rsvpStatus ('Confirmed', 'Declined', 'Tentative')
   - adults (number)
   - kids (number)
   - infants (number)
   - side ('Bride', 'Groom', 'Common')
   - group ('Family', 'Friend', 'Colleague', 'Other')
   - dietaryRestrictions (Array: 'Veg', 'Non-Veg', 'Jain', 'Vegan')
   - allergies (string)
   - events (Array: 'Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception')
   - arrival: { date: string, time: string, mode: 'Flight' | 'Train' | 'Car' | 'Bus' | 'Other' }
   - accommodation: { isRequired: boolean, roomsNeeded: number }

2. If the user mentions headcount (total or split), update the adults/kids/infants counts accordingly.
3. If information is missing or unclear, ask for it politely in your response.
4. If the user provides info in an unstructured way (e.g., "coming with 2 kids, arriving on 15th by flight"), parse it into the schema.
5. If the user is declining, be gracious and stop asking for details.
6. Your response should be a JSON object with two fields:
   - "updatedData": The full updated guest object.
   - "reply": A friendly WhatsApp message to send back to the user.

FORMAT YOUR ENTIRE RESPONSE AS A VALID JSON OBJECT.
`;

export async function processWhatsAppWithAI(message: string, currentData: Partial<Guest>) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return {
                updatedData: currentData,
                reply: "I'm sorry, I'm currently having some technical difficulties (Missing API Key). Please try the web link instead!"
            };
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = SYSTEM_PROMPT
            .replace('{currentData}', JSON.stringify(currentData, null, 2))
            .replace('{message}', message);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response (sometimes Gemini wraps it in ```json)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                updatedData: parsed.updatedData as Partial<Guest>,
                reply: parsed.reply as string
            };
        }

        throw new Error('Could not parse AI response');
    } catch (error) {
        console.error('AI Processing Error:', error);
        return {
            updatedData: currentData,
            reply: "I'm sorry, I couldn't process that. Could you please say that again or use the link I sent?"
        };
    }
}
