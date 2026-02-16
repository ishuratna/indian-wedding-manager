import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { sendWhatsAppMessage } from './client';
import { Guest, Side, RSVPStatus, Dietary, Group, AgeGroup } from '@/app/types/guest';

type ConversationStep =
    | 'START'
    | 'AWAIT_NAME'
    | 'AWAIT_EMAIL'
    | 'AWAIT_SIDE'
    | 'AWAIT_GROUP'
    | 'AWAIT_RSVP'
    | 'AWAIT_AGE_GROUP'
    | 'AWAIT_DIET'
    | 'AWAIT_ACCOMMODATION'
    | 'AWAIT_ARRIVAL_DATE'
    | 'AWAIT_ARRIVAL_MODE'
    | 'AWAIT_DEPARTURE_DATE'
    | 'COMPLETED';

interface ConversationState {
    step: ConversationStep;
    data: Partial<Guest>;
    lastUpdated: any;
}

export async function processConversation(phone: string, messageBody: string, nameFromProfile: string) {
    const stateRef = doc(db, 'conversation_states', phone);
    const stateSnap = await getDoc(stateRef);

    let state: ConversationState = stateSnap.exists()
        ? stateSnap.data() as ConversationState
        : { step: 'START', data: { phone }, lastUpdated: serverTimestamp() };

    const input = messageBody.trim();

    // Global Reset command
    if (['reset', 'restart', 'start over', 'hi', 'hello'].includes(input.toLowerCase())) {
        // Only reset if they explicitly ask or say hi when at START/COMPLETED. 
        // If mid-flow, "hi" shouldn't reset, but let's keep it simple for now. 
        // Better: if "reset" -> full reset. If "hi" and state exists -> continue or ignore.
        if (input.toLowerCase() === 'reset' || input.toLowerCase() === 'restart') {
            state = { step: 'START', data: { phone }, lastUpdated: serverTimestamp() };
        }
        // If "hi" comes in and we are already deep in conversation, we might want to ignore it acting as a reset
        // But for this "Start" logic, let's treat it as a trigger only if step is START.
    }

    // State Machine
    switch (state.step) {
        case 'START':
            await sendWhatsAppMessage(phone, 'text', `Namaste ${nameFromProfile}! Welcome to the Wedding Manager Bot. 🤖\n\nLet's get you on the guest list. \n\nWhat is your full name?`);
            state.step = 'AWAIT_NAME';
            break;

        case 'AWAIT_NAME':
            state.data.fullName = input;
            await sendWhatsAppMessage(phone, 'text', `Thanks ${input}. \n\nWhat is your email address? (Type 'skip' if none)`);
            state.step = 'AWAIT_EMAIL';
            break;

        case 'AWAIT_EMAIL':
            if (input.toLowerCase() !== 'skip') {
                state.data.email = input;
            }
            await sendWhatsAppMessage(phone, 'text', `Which side are you from? (Reply 1, 2, or 3)\n1. Groom\n2. Bride\n3. Common`);
            state.step = 'AWAIT_SIDE';
            break;

        case 'AWAIT_SIDE':
            if (input.includes('1') || input.toLowerCase().includes('groom')) state.data.side = 'Groom';
            else if (input.includes('2') || input.toLowerCase().includes('bride')) state.data.side = 'Bride';
            else if (input.includes('3') || input.toLowerCase().includes('common')) state.data.side = 'Common';
            else {
                await sendWhatsAppMessage(phone, 'text', "Please reply with 1 (Groom), 2 (Bride), or 3 (Common).");
                return;
            }

            await sendWhatsAppMessage(phone, 'text', "How do you know the couple? (Reply 1-4)\n1. Family\n2. Friend\n3. Colleague\n4. Other");
            state.step = 'AWAIT_GROUP';
            break;

        case 'AWAIT_GROUP':
            if (input.includes('1') || input.toLowerCase().includes('family')) state.data.group = 'Family';
            else if (input.includes('2') || input.toLowerCase().includes('friend')) state.data.group = 'Friend';
            else if (input.includes('3') || input.toLowerCase().includes('colleague')) state.data.group = 'Colleague';
            else state.data.group = 'Other';

            await sendWhatsAppMessage(phone, 'text', "Will you be attending the wedding? (Reply Yes/No)");
            state.step = 'AWAIT_RSVP';
            break;

        case 'AWAIT_RSVP':
            if (input.toLowerCase().includes('yes')) state.data.rsvpStatus = 'Confirmed';
            else if (input.toLowerCase().includes('no')) state.data.rsvpStatus = 'Declined';
            else {
                await sendWhatsAppMessage(phone, 'text', "Please reply with Yes or No.");
                return;
            }

            if (state.data.rsvpStatus === 'Declined') {
                await saveGuest(phone, state.data);
                await sendWhatsAppMessage(phone, 'text', "We'll miss you! Thanks for letting us know.");
                await deleteDoc(stateRef);
                return;
            }

            await sendWhatsAppMessage(phone, 'text', "Great! Are you an Adult or Child? (Reply 1 or 2)\n1. Adult\n2. Child");
            state.step = 'AWAIT_AGE_GROUP';
            break;

        case 'AWAIT_AGE_GROUP':
            if (input.toLowerCase().includes('child') || input.includes('2')) state.data.ageGroup = 'Child';
            else state.data.ageGroup = 'Adult';

            await sendWhatsAppMessage(phone, 'text', "Any dietary preferences? (Veg, Non-Veg, Vegan, None)");
            state.step = 'AWAIT_DIET';
            break;

        case 'AWAIT_DIET':
            const diet = input.toLowerCase();
            const restrictions: Dietary[] = [];
            if (diet.includes('veg') && !diet.includes('non')) restrictions.push('Veg');
            if (diet.includes('non')) restrictions.push('Non-Veg');
            if (diet.includes('vegan')) restrictions.push('Vegan');
            state.data.dietaryRestrictions = restrictions;

            await sendWhatsAppMessage(phone, 'text', "Do you need accommodation provided by us? (Yes/No)");
            state.step = 'AWAIT_ACCOMMODATION';
            break;

        case 'AWAIT_ACCOMMODATION':
            const needsAcc = input.toLowerCase().includes('yes');
            if (needsAcc) {
                state.data.accommodation = { isRequired: true, roomsNeeded: 1 };
            } else {
                state.data.accommodation = { isRequired: false, roomsNeeded: 0 };
            }

            await sendWhatsAppMessage(phone, 'text', "When are you arriving? (e.g. '15th Dec 10 AM' or 'Skip')");
            state.step = 'AWAIT_ARRIVAL_DATE';
            break;

        case 'AWAIT_ARRIVAL_DATE':
            if (input.toLowerCase() !== 'skip') {
                state.data.arrival = {
                    date: input, // Storing unstructured string for now
                    time: '',
                    mode: 'Car', // Default
                    pickupRequired: false
                };
                await sendWhatsAppMessage(phone, 'text', "How are you arriving? (Flight, Train, Car, Bus)");
                state.step = 'AWAIT_ARRIVAL_MODE';
            } else {
                // Skip arrival/departure details if they skip arrival date
                await finalizeGuest(phone, state.data, stateRef);
            }
            break;

        case 'AWAIT_ARRIVAL_MODE':
            if (state.data.arrival) {
                const mode = input.toLowerCase();
                if (mode.includes('flight')) state.data.arrival.mode = 'Flight';
                else if (mode.includes('train')) state.data.arrival.mode = 'Train';
                else if (mode.includes('bus')) state.data.arrival.mode = 'Bus';
                else state.data.arrival.mode = 'Car';
            }

            await sendWhatsAppMessage(phone, 'text', "When are you departing? (e.g. '17th Dec 5 PM' or 'Skip')");
            state.step = 'AWAIT_DEPARTURE_DATE';
            break;

        case 'AWAIT_DEPARTURE_DATE':
            if (input.toLowerCase() !== 'skip') {
                state.data.departure = {
                    date: input,
                    time: '',
                    mode: state.data.arrival?.mode || 'Car', // Assume same return mode
                    dropoffRequired: false
                };
            }
            await finalizeGuest(phone, state.data, stateRef);
            break;
    }

    // Save updated state
    await setDoc(stateRef, { ...state, lastUpdated: serverTimestamp() });
}

async function finalizeGuest(phone: string, data: Partial<Guest>, stateRef: any) {
    // Falls back to the development ID if environment variable is not set.
    // In production (easyweddings.in), set DEFAULT_WEDDING_ID to your Planner UID in Vercel.
    data.weddingId = process.env.DEFAULT_WEDDING_ID || 'llDG0SokS2a2DA00c6Ab';
    data.whatsappOptIn = true;

    await saveGuest(phone, data);
    await sendWhatsAppMessage(phone, 'text', "You're all set! 🎊 We have recorded your details including travel & stay. \n\nSee you at the wedding!");
    await deleteDoc(stateRef);
}

async function saveGuest(phone: string, data: Partial<Guest>) {
    const q = query(collection(db, 'guests'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } else {
        await addDoc(collection(db, 'guests'), {
            ...data,
            createdAt: serverTimestamp()
        });
    }
}
