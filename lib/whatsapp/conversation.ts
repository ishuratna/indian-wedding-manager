import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { sendWhatsAppMessage } from './client';
import { Guest } from '@/app/types/guest';
import { processWhatsAppWithAI } from './agent';

export async function processConversation(phone: string, messageBody: string, nameFromProfile: string) {
    // 1. Get or create current guest data
    const q = query(collection(db, 'guests'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    let currentGuest: Partial<Guest> = { phone, fullName: nameFromProfile };
    let guestDocRef = null;

    if (!querySnapshot.empty) {
        guestDocRef = querySnapshot.docs[0].ref;
        currentGuest = querySnapshot.docs[0].data() as Guest;
    }

    const input = messageBody.trim();

    // 2. Clear state/reset if needed
    if (['reset', 'restart'].includes(input.toLowerCase())) {
        await sendWhatsAppMessage(phone, 'text', "Sure, let's start over! What is your full name?");
        // We don't delete the guest, just reset the AI context in their mind
        return;
    }

    // 3. Handle specific RSVP Validation message
    if (input.toLowerCase().includes('confirming my whatsapp')) {
        if (guestDocRef) {
            await setDoc(guestDocRef, { whatsappOptIn: true, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            await addDoc(collection(db, 'guests'), {
                ...currentGuest,
                whatsappOptIn: true,
                weddingId: process.env.DEFAULT_WEDDING_ID || 'llDG0SokS2a2DA00c6Ab',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
        await sendWhatsAppMessage(phone, 'text', "Thank you for contacting us, we will get back to you shortly.");
        return;
    }

    // 3. Process with AI
    const { updatedData, reply } = await processWhatsAppWithAI(input, currentGuest);

    // 4. Save updated data
    if (guestDocRef) {
        await setDoc(guestDocRef, { ...updatedData, updatedAt: serverTimestamp() }, { merge: true });
    } else {
        const newDocRef = await addDoc(collection(db, 'guests'), {
            ...updatedData,
            weddingId: process.env.DEFAULT_WEDDING_ID || 'llDG0SokS2a2DA00c6Ab',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    // 5. Send AI's reply
    await sendWhatsAppMessage(phone, 'text', reply);
}
